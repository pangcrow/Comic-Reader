import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import { useAsync } from 'react-async';
import { Layout } from '../Layout';
import { GridContainer } from '../GridContainer';
import { Grid } from '../Grid';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import { SearchHeader } from './SearchHeader';
import { SearchResults, SearchParam } from '../../../typing';
import { searchAPI } from '../../apis';
import SearchResultActionCreator, {
  SearchResultsActions
} from '../../actions/searchResult';
import { RootState } from '../../reducers';
import { SearchResultState } from '../../reducers/searchResult';

const placeholders: SearchResults = new Array(20).fill({});

function mapStateToProps({ searchResult }: RootState, ownProps: any) {
  return {
    ...searchResult,
    ...ownProps
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(SearchResultActionCreator, dispatch);
}

//  TODO:
// - Search fails handling

function SearchComponent({
  page,
  keyword,
  searchResults,
  noMoreResult,
  setKeyword,
  setNoMoreResult,
  setSearchResults,
  addSearchResults
}: SearchResultState & SearchResultsActions) {
  const { isLoading, run } = useAsync({
    deferFn: ([params]: SearchParam[]) => searchRequest(params)
  });

  function searchRequest(params: SearchParam) {
    return searchAPI(params).then(data => {
      setNoMoreResult(data.length < 20);

      return data;
    });
  }

  function onSearch() {
    if (keyword.trim()) {
      setSearchResults([]);

      run({
        keyword
      }).then((data: SearchResults) => {
        setSearchResults(data);
      });
    }
  }

  function loadMoreResult() {
    if (!noMoreResult) {
      const nextPage = page + 1;
      const from = searchResults.length;
      const to = searchResults.length + placeholders.length;

      addSearchResults({
        searchResults: placeholders.slice(0),
        page: nextPage
      });

      return searchRequest({ keyword, page: nextPage }).then(searchResults => {
        addSearchResults({
          searchResults,
          page: nextPage,
          from,
          to
        });
      });
    }

    return Promise.resolve();
  }

  return (
    <Layout className="search">
      <SearchHeader
        value={keyword}
        onSearch={onSearch}
        onInputChange={(keyword: string) => setKeyword(keyword)}
      />
      <div className="search-results">
        {isLoading ? (
          <div className="wrapper">
            <LoadingSpinner />
          </div>
        ) : (
          <AutoSizer>
            {({ width, height }) => (
              <GridContainer
                width={width}
                height={height}
                list={searchResults}
                onGridRender={props => <Grid {...props} />}
                loadMore={loadMoreResult}
                noContentRenderer={() =>
                  noMoreResult && <div className="wrapper">搵唔到</div>
                }
              />
            )}
          </AutoSizer>
        )}
      </div>
    </Layout>
  );
}

export const Search = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchComponent);
