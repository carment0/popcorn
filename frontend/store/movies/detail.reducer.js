/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { MOVIE_DETAIL_FETCH_SUCCESS, MOVIE_DETAIL_FETCH_FAIL } from './detail.action';


export default function movieDetailReducer(state = {}, action) {
  Object.freeze(state);

  switch (action.type) {
    case MOVIE_DETAIL_FETCH_SUCCESS:
      const newState = {};
      newState[action.payload.imdb_id] = {
        title: action.payload.title,
        year: action.payload.release_date.slice(0, 4),
        plot: action.payload.overview,
        poster: `https://image.tmdb.org/t/p/w300${action.payload.poster_path}`
      };
      return merge({}, state, newState);

    case MOVIE_DETAIL_FETCH_FAIL:
      console.log(`Failed to fetch metadata for movie ${action.imdbId}`, action.error);
      return state;

    default:
      return state;
  }
}
