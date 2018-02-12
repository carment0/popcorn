/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng, Carmen To
 */

// Thirdparty imports
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// Reducers
import errorReducer from './errors';
import sessionReducer from './users/session.reducer';
import movieRatingReducer from './movies/rating.reducer';
import movieDetailReducer from './movies/detail.reducer';
import movieReducer from './movies/movie.reducer';

/**
 * Instead of nesting many reducers within reducers, we are taking a flat tree approach. All keys should be on the first
 * layer of the Redux tree.
 */
const rootReducer = combineReducers({
  session: sessionReducer,
  errors: errorReducer,
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
