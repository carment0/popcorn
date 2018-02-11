/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { MOST_VIEWED_MOVIES_FETCH_SUCCESS } from './movie.action';

const defaultState = {
  mostViewed: {},
  recommended: {}
};

export default function movieReducer(state = defaultState, action) {
  Object.freeze(state);
  switch (action.type) {
    case MOST_VIEWED_MOVIES_FETCH_SUCCESS:
      const newState = {
        mostViewed: {}
      };

      action.payload.forEach((movie) => {
        newState.mostViewed[movie.id] = movie;
      });

      return merge({}, state, newState);
    default:
      return state;
  }
}
