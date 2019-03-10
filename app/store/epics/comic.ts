import { from, of } from 'rxjs';
import { map, catchError, takeUntil, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { getComicDataAPI } from '../../apis';
import {
  ComicActions,
  ComicActionTypes,
  GetComic,
  getComicSuccess
} from '../actions/comic';
import { ApiError } from '../../../typing';

const getComicEpic: Epic<ComicActions> = action$ =>
  action$.pipe(
    ofType<ComicActions, GetComic>(ComicActionTypes.GET_COMIC),
    mergeMap(action =>
      from(getComicDataAPI(action.payload)).pipe(
        map(getComicSuccess),
        catchError((error: ApiError) =>
          of<ComicActions>({
            type: ComicActionTypes.GET_COMIC_FAIL,
            payload: error
          })
        ),
        takeUntil(action$.pipe(ofType(ComicActionTypes.GET_COMIC_CANCELED)))
      )
    )
  );

export default [getComicEpic];
