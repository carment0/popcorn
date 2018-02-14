/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { ALL_MOVIES_FETCH_SUCCESS, ALL_MOVIES_FETCH_FAIL } from './movie.action';
import { MOST_VIEWED_MOVIES_FETCH_SUCCESS, MOST_VIEWED_MOVIES_FETCH_FAIL } from './movie.action';
import { RECOMMENDED_MOVIES_FETCH_SUCCESS, RECOMMENDED_MOVIES_FETCH_FAIL } from './movie.action';
import { MOVIE_SKIPPED } from './movie.action';


function allMovieReducer(state = {}, action) {
  Object.freeze(state);

  switch (action.type) {
    case ALL_MOVIES_FETCH_SUCCESS:
      const newState = {};
      action.payload.forEach((movie) => {
        newState[movie.id] = movie;
      });
      return merge({}, state, newState);

    case ALL_MOVIES_FETCH_FAIL:
      console.log('Failed to fetch all movies', action.error);
      return state;

    default:
      return state;
  }
}

function mostViewedMovieReducer(state = new Set(), action) {
  Object.freeze(state);

  switch (action.type) {
    case MOST_VIEWED_MOVIES_FETCH_SUCCESS:
      action.payload.forEach((movie) => {
        state.add(movie.id);
      });
      return state;

    case MOST_VIEWED_MOVIES_FETCH_FAIL:
      console.log('Failed to fetch most viewed movies', action.error);
      return state;

    default:
      return state;
  }
}

function recommendedMovieReducer(state = new Set(), action) {
  Object.freeze(state);

  switch (action.type) {
    case RECOMMENDED_MOVIES_FETCH_SUCCESS:
      action.payload.forEach((movie) => {
        state.add(movie.id);
      });
      return state;

    case RECOMMENDED_MOVIES_FETCH_FAIL:
      console.log('Failed to fetch recommended movies', action.error);
      return state;

    default:
      return state;
  }
}

function skippedMovieReducer(state = new Set(), action) {
  Object.freeze(state);

  switch (action.type) {
    case MOVIE_SKIPPED:
      state.add(action.movieId);
      return state;

    default:
      return state;
  }
}

// NOTE: The keys (mostViewed, recommended, and skipped) are holding a set while the key 'all' is holding all
// the data of the movies. This is to minimize data duplication and to improve performance of front end.
export default combineReducers({
  all: allMovieReducer,
  mostViewed: mostViewedMovieReducer,
  recommended: recommendedMovieReducer,
  skipped: skippedMovieReducer
});
