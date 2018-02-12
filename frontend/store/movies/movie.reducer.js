/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { MOST_VIEWED_MOVIES_FETCH_SUCCESS, MOST_VIEWED_MOVIES_FETCH_FAIL } from './movie.action';
import { RECOMMENDED_MOVIES_FETCH_SUCCESS, RECOMMENDED_MOVIES_FETCH_FAIL } from './movie.action';
import { MOVIE_SKIPPED } from './movie.action';


const defaultState = {};

function mostViewedMovieReducer(state = defaultState, action) {
  Object.freeze(state);
  switch (action.type) {
    case MOST_VIEWED_MOVIES_FETCH_SUCCESS:
      const newState = {};
      action.payload.forEach((movie) => {
        newState[movie.id] = movie;
      });
      return merge({}, state, newState);

    case MOST_VIEWED_MOVIES_FETCH_FAIL:
      console.log('Failed to fetch most viewed movies', action.error);
      return state;

    default:
      return state;
  }
}

function recommendedMovieReducer(state = defaultState, action) {
  Object.freeze(state);
  switch (action.type) {
    case RECOMMENDED_MOVIES_FETCH_SUCCESS:
      return state;

    case RECOMMENDED_MOVIES_FETCH_FAIL:
      return state;

    default:
      return state;
  }
}

function skippedMovieReducer(state = defaultState, action) {
  Object.freeze(state);
  switch (action.type) {
    case MOVIE_SKIPPED:
      const newState = {};
      newState[action.movieId] = true;
      return merge({}, state, newState);

    default:
      return state;
  }
}

// Not exactly sure if I need rated and skipped, they can simply be boolean values because the data should be contained
// within mostViewed and recommended.
export default combineReducers({
  mostViewed: mostViewedMovieReducer,
  recommended: recommendedMovieReducer,
  skipped: skippedMovieReducer
});
