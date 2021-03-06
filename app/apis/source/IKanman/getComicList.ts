import { api } from './api';
import { GetComicListParam, ComicItemList } from '../../../../typing';

export async function getComicList({
  page = 1,
  filter
}: GetComicListParam): Promise<ComicItemList> {
  const pageStr = page === 1 ? '' : `_p${page}`;
  const filterPath = getFilterPath(filter);
  const { data: $ } = await api.get(`/list/${filterPath}update${pageStr}.html`);
  const $contList = $('#contList li');

  if ($contList.length > 1) {
    const comicList = $contList
      .map((index: number, item: CheerioElement) => {
        const $item = $(item);
        const $cover = $item.find('.bcover img');
        const $latest = $item.find('.tt');
        const $aTag = $item.find('.ell a');
        const $updateTime = $item.find('.updateon');
        const $status = $item.find('.bcover span:last-child');

        const cover = $cover.attr('src') || $cover.attr('data-src');

        return {
          comicID: $aTag.attr('href').replace(/[^\d.]+/g, ''),
          name: $aTag.attr('title'),
          cover: cover.replace(/\/[a-z]\//, '/h/'),
          latest: $latest.text(),
          updateTime: $updateTime.text(),
          status: $status.attr('class') === 'sl' ? '連載' : '完結'
        };
      })
      .toArray();

    return comicList;
  }

  return Promise.reject({
    response: {
      status: '',
      statusText: $contList.text().replace(/\s/g, '')
    }
  });
}

function getFilterPath(arr: string[] | undefined = []) {
  const fitler = arr.filter(Boolean);
  return fitler.length ? `${fitler.join('_')}/` : '';
}
