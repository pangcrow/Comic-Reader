import React, { ReactNode, useLayoutEffect, useState, useRef } from 'react';
import { useAsync } from 'react-async';
import { Grid, GridCellProps, OnScrollParams } from 'react-virtualized';
import throttle from 'lodash/throttle';
import { OnSectionRenderedParams } from 'react-virtualized/dist/es/ArrowKeyStepper';

export interface HomeGridContainerProps {
  width: number;
  height: number;
  gridEl: HTMLElement | null;
  list: any[];
  hidden?: boolean;
  loadMore?: () => Promise<any>;
  onGridRender: (props: any) => ReactNode;
}

const spacer = 15;

// const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

export function HomeGridContainer({
  width,
  height,
  gridEl,
  list,
  hidden,
  loadMore,
  onGridRender
}: HomeGridContainerProps) {
  const gridRef = useRef(null);
  const scrollTopRef = useRef(Number(localStorage.getItem('scrollTop')));
  const [{ columnCount, columnWidth }, setColumnData] = useState({
    columnCount: 0,
    columnWidth: 0
  });

  const calcColumnData = () => {
    const width_ = width - spacer * 2;
    const tempcolumnWidth = gridEl ? gridEl.offsetWidth : 0; // offsetWith not return decimal, so we not count this value
    const columnCount = Math.floor(width / tempcolumnWidth);
    const columnWidth = (width_ - spacer * columnCount) / columnCount;

    return {
      columnWidth,
      columnCount
    };
  };

  const { isLoading, run } = useAsync({
    // deferFn: () => delay(5000)
    deferFn: () => loadMore()
  });
  const isLoadingRef = useRef(isLoading);

  const loadMoreHandler = () => {
    if (!isLoading) {
      run();
    }
  };

  const onResizeHandler = throttle(() => {
    setColumnData(calcColumnData());
  }, 100);

  function cellRenderer({ key, style, rowIndex, columnIndex }: GridCellProps) {
    const index = rowIndex * columnCount + columnIndex;
    return (
      <div style={style} key={key}>
        <div style={{ padding: `${spacer / 2}px` }}>
          {onGridRender(list[index])}
        </div>
      </div>
    );
  }

  function onScroll({ scrollTop }: OnScrollParams) {
    scrollTopRef.current = scrollTop;
  }

  useLayoutEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useLayoutEffect(() => {
    onResizeHandler();
  }, [width, height]);

  useLayoutEffect(() => {
    return () => {
      localStorage.setItem('scrollTop', String(scrollTopRef.current));
    };
  }, []);

  return (
    !hidden &&
    columnCount &&
    columnWidth && (
      <>
        <Grid
          className="home-grid-container"
          columnCount={columnCount}
          columnWidth={columnWidth + spacer}
          rowCount={list.length / columnCount}
          rowHeight={columnWidth / 0.75 + spacer}
          height={height}
          width={width}
          cellRenderer={cellRenderer}
          style={{ padding: `${spacer}px`, outline: 0 }}
          onScroll={onScroll}
          ref={gridRef}
          overscanRowCount={1}
          onSectionRendered={({ rowStopIndex }: OnSectionRenderedParams) => {
            const rowCount = list.length / columnCount;

            if (rowStopIndex - rowCount >= -1) {
              loadMoreHandler();
            }
          }}
        />
        {/* {isLoading ? '<div>isLoading</div>' : ''} */}
      </>
    )
  );
}
