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


const defaultState = {};

function allMovieReducer(state = defaultState, action) {
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

function mostViewedMovieReducer(state = defaultState, action) {
  Object.freeze(state);
  switch (action.type) {
    case MOST_VIEWED_MOVIES_FETCH_SUCCESS:
      const newState = {};
      action.payload.forEach((movie) => {
        newState[movie.id] = true;
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
      const newState = {};
      action.payload.forEach((movie) => {
        newState[movie.id] = true;
      });
      return merge({}, state, newState);

    case RECOMMENDED_MOVIES_FETCH_FAIL:
      console.log('Failed to fetch recommended movies', action.error);
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

// NOTE: Only mostViewed, recommended, and skipped have boolean values and only all contains the actual data of the
// the movies. This is to minimize data duplication.
export default combineReducers({
  all: allMovieReducer,
  mostViewed: mostViewedMovieReducer,
  recommended: recommendedMovieReducer,
  skipped: skippedMovieReducer
});
