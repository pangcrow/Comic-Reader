import { Action } from 'redux';
import { ComicItemList, GetComicListParam, ApiError } from '../../../typing';

export enum ComicListActionTypes {
  GET_COMICS_LIST = 'GET_COMICS_LIST',
  GET_COMICS_LIST_SUCCESS = 'GET_COMICS_LIST_SUCCESS',
  GET_COMICS_LIST_FAIL = 'GET_COMICS_LIST_FAIL',
  GET_COMICS_LIST_CANCELED = 'GET_COMICS_LIST_CANCELED',
  SET_FILTER = 'SET_FILTER'
}

export interface GetComicList extends Action {
  type: ComicListActionTypes.GET_COMICS_LIST;
  payload: GetComicListParam;
}

export interface GetComicListSuccess extends Action {
  type: ComicListActionTypes.GET_COMICS_LIST_SUCCESS;
  payload: ComicItemList;
}

export interface GetComicListFailed extends Action {
  type: ComicListActionTypes.GET_COMICS_LIST_FAIL;
  payload: ApiError;
}

export interface GetComicListCanceled extends Action {
  type: ComicListActionTypes.GET_COMICS_LIST_CANCELED;
}

export interface SetFilter extends Action {
  type: ComicListActionTypes.SET_FILTER;
  payload: string[];
}

export type ComicListActions =
  | GetComicList
  | GetComicListSuccess
  | GetComicListFailed
  | GetComicListCanceled
  | SetFilter;

export function getComicList(payload: GetComicListParam): GetComicList {
  return {
    type: ComicListActionTypes.GET_COMICS_LIST,
    payload
  };
}

export function setFilter(payload: string[]): SetFilter {
  return {
    type: ComicListActionTypes.SET_FILTER,
    payload
  };
}

export function cancelGetComicList(): GetComicListCanceled {
  return {
    type: ComicListActionTypes.GET_COMICS_LIST_CANCELED
  };
}

export const ComicListActionCreators = {
  cancelGetComicList,
  getComicList,
  setFilter
};
