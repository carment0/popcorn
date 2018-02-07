/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import { USER_PREFERENCE_FETCH_START } from './preference.action';
import { USER_PREFERENCE_FETCH_SUCCESS } from './preference.action';
import { USER_PREFERENCE_FETCH_FAIL } from './preference.action';

const defaultState = {
  isFetching: false,
  error: false,
  preferenceVector: []
};

export default function userPreferenceReducer(state = defaultState, action) {
  switch (action.type) {
    case USER_PREFERENCE_FETCH_START:
      return Object.assign({}, state, {
        isFetching: true,
        error: false
      });

    case USER_PREFERENCE_FETCH_SUCCESS:
      const preferenceVector = action.preferenceVector;
      return Object.assign({}, state, { preferenceVector }, {
        isFetching: false,
        error: false
      });

    case USER_PREFERENCE_FETCH_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        error: true
      });

    default:
      return state;
  }
}
