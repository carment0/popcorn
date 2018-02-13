/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

const defaultState = {
  minYear: 1930,
  maxYear: 2018
};

export default function movieYearRangeReducer(state = defaultState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
