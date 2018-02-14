/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

export const SET_MOVIE_POPULARITY_PERCENTILE = 'SET_MOVIE_POPULARITY_PERCENTILE';

export const setMoviePopularityPercentile = (percentile) => (dispatch) => {
  return dispatch({ type: SET_MOVIE_POPULARITY_PERCENTILE, percentile });
};
