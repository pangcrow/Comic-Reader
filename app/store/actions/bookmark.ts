import { Action } from 'redux';
import { GridData } from '../../../typing';

export enum BookmarkActionTypes {
  ADD_BOOKMARK = 'ADD_BOOKMARK',
  ADD_BOOKMARK_SUCCESS = 'ADD_BOOKMARK_SUCCESS',
  REMOVE_BOOKMARK = 'REMOVE_BOOKMARK',
  REMOVE_ALL_BOOKMARK = 'REMOVE_ALL_BOOKMARK',
  REFETCH_BOOKMARK = 'REFETCH_BOOKMARK',
  REFETCH_BOOKMARK_SUCCESS = 'REFETCH_BOOKMARK_SUCCESS',
  TOGGLE_BOOKMARK_REMOVABLE = 'TOGGLE_BOOKMARK_REMOVABLE',
  SAVE_BOOKMARK = 'SAVE_BOOKMARK'
}

export interface AddBookmark extends Action {
  type: BookmarkActionTypes.ADD_BOOKMARK;
  payload: string;
}

export interface AddBookmarkSuccess extends Action {
  type: BookmarkActionTypes.ADD_BOOKMARK_SUCCESS;
  payload: GridData;
}

export interface RemoveBookmark extends Action {
  type: BookmarkActionTypes.REMOVE_BOOKMARK;
  payload: string;
}

export interface RemoveAllBookmark extends Action {
  type: BookmarkActionTypes.REMOVE_ALL_BOOKMARK;
}

export interface RefetchBookmark extends Action {
  type: BookmarkActionTypes.REFETCH_BOOKMARK;
  payload: string;
}

export interface RefetchBookmarkSuccess extends Action {
  type: BookmarkActionTypes.REFETCH_BOOKMARK_SUCCESS;
  payload: GridData;
}

export interface ToggleBookmarkRemovable extends Action {
  type: BookmarkActionTypes.TOGGLE_BOOKMARK_REMOVABLE;
  payload?: boolean;
}

export interface SaveBookmark extends Action {
  type: BookmarkActionTypes.SAVE_BOOKMARK;
}

export type BookmarkActions =
  | AddBookmark
  | AddBookmarkSuccess
  | RemoveBookmark
  | RemoveAllBookmark
  | RefetchBookmark
  | RefetchBookmarkSuccess
  | ToggleBookmarkRemovable
  | SaveBookmark;

export function addBookmark(comicID: string): AddBookmark {
  return {
    type: BookmarkActionTypes.ADD_BOOKMARK,
    payload: comicID
  };
}

export function removeBookmark(comicID: string): RemoveBookmark {
  return {
    type: BookmarkActionTypes.REMOVE_BOOKMARK,
    payload: comicID
  };
}

export function removeAllBookmark(): RemoveAllBookmark {
  return {
    type: BookmarkActionTypes.REMOVE_ALL_BOOKMARK
  };
}

export function refetchBookmark(comicID: string): RefetchBookmark {
  return {
    type: BookmarkActionTypes.REFETCH_BOOKMARK,
    payload: comicID
  };
}

export function toggleBookmarkRemovable(
  payload?: boolean
): ToggleBookmarkRemovable {
  return {
    type: BookmarkActionTypes.TOGGLE_BOOKMARK_REMOVABLE,
    payload
  };
}

export const BookmarkActionCreators = {
  addBookmark,
  removeBookmark,
  removeAllBookmark,
  refetchBookmark,
  toggleBookmarkRemovable
};
