/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { MOVIE_RATING_POST_SUCCESS, MOVIE_RATING_POST_FAIL, MOVIE_RATING_RECORDED } from './rating.action';


export default function movieRatingReducer(state = {}, action) {
  Object.freeze(state);

  switch (action.type) {
    case MOVIE_RATING_RECORDED:
      const newState = {};
      newState[action.movieId] = action.value;
      return merge({}, state, newState);

    case MOVIE_RATING_POST_SUCCESS:
      return state;

    case MOVIE_RATING_POST_FAIL:
      console.log('Failed to post rating to server', action.error);
      return state;

    default:
      return state;
  }
}
