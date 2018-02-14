/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng, Carmen To
 */

import merge from 'lodash/merge';
import { SET_MOVIE_YEAR_RANGE } from './year_range.action';

const defaultState = {
  minYear: 1930,
  maxYear: 2018
};

export default function movieYearRangeReducer(state = defaultState, action) {
  Object.freeze(state);

  switch (action.type) {
    case SET_MOVIE_YEAR_RANGE:
      const newState = { minYear: action.minYear, maxYear: action.maxYear };
      return merge({}, state, newState);
    default:
      return state;
  }
}
