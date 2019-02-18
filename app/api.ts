import axios, { AxiosResponse } from 'axios';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer
} from 'axios-extensions';

import {
  GetLatestUpdateParam,
  ComicItemList,
  GetComicDataParam,
  ComicData,
  GetContentDataParam,
  ContentData,
  SearchParam,
  SearchResults
} from '../typing';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
});

let getLatestUpdateQueue = Promise.resolve([]);

export function getLatestUpdate(params?: GetLatestUpdateParam) {
  getLatestUpdateQueue = getLatestUpdateQueue.then(() =>
    api
      .get('/update', {
        params
      })
      .then(({ data }: AxiosResponse<ComicItemList>) => data)
  );

  return getLatestUpdateQueue;
}

export function getComicData({ comicID }: GetComicDataParam) {
  return api
    .get(`/comic/${comicID}`)
    .then(({ data }: AxiosResponse<ComicData>) => data);
}

export function getContentData({ comicID, chapterID }: GetContentDataParam) {
  return api
    .get(`/content/${comicID}/${chapterID}`)
    .then(({ data }: AxiosResponse<ContentData>) => data);
}

export function search(params: SearchParam) {
  return api
    .get(`/search`, {
      params
    })
    .then(({ data }: AxiosResponse<SearchResults>) => data);
}
