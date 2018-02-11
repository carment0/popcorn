/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import errorsReducer from './errors';
import sessionReducer from './users/session.reducer';
import userPreferenceReducer from './users/preference.reducer';
import movieRatingReducer from './movies/rating.reducer';
import movieDetailReducer from './movies/detail.reducer';
import movieReducer from './movies/movie.reducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  errors: errorsReducer,
  userPreference: userPreferenceReducer,
  movieRatings: movieRatingReducer,
  movieDetails: movieDetailReducer,
  movies: movieReducer
});

const preloadedState = {};

if (window.currentUser) {
  preloadedState.sessions = { currentUser: window.currentUser };
  delete window.currentUser;
}

export default createStore(rootReducer, preloadedState, applyMiddleware(thunk, logger));
