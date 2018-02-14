/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

export const SET_MOVIE_YEAR_RANGE = 'SET_MOVIE_YEAR_RANGE';

export const setMovieYearRange = (minYear, maxYear) => (dispatch) => {
  return dispatch({ type: SET_MOVIE_YEAR_RANGE, minYear, maxYear });
};
