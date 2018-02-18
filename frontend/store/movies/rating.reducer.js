/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import {
  MOVIE_RATING_POST_SUCCESS,
  MOVIE_RATING_POST_FAIL,
  MOVIE_RATING_RECORDED,
  MOVIE_RATINGS_FETCH_SUCCESS,
  MOVIE_RATINGS_FETCH_FAIL } from './rating.action';
import { LOGOUT_SUCCESS } from '../users/session.action';


export default function movieRatingReducer(state = {}, action) {
  Object.freeze(state);

  const newState = {};
  switch (action.type) {
    case MOVIE_RATINGS_FETCH_SUCCESS:
      action.payloads.forEach((payload) => {
        newState[payload.movie_id] = payload.rating;
      });
      return merge({}, state, newState);

    case MOVIE_RATINGS_FETCH_FAIL:
      console.log('Failed to fetch ratings from server', action.error);
      return state;

    case MOVIE_RATING_RECORDED:
      newState[action.movieId] = action.value;
      return merge({}, state, newState);

    case MOVIE_RATING_POST_SUCCESS:
      newState[action.movieId] = action.value;
      return merge({}, state, newState);

    case MOVIE_RATING_POST_FAIL:
      console.log('Failed to post rating to server', action.error);
      return state;

    case LOGOUT_SUCCESS:
      return newState;

    default:
      return state;
  }
}
