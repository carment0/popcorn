/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request from 'axios';

export const MOST_VIEWED_MOVIES_FETCH_SUCCESS = 'MOST_VIEWED_MOVIES_FETCH_SUCCESS';
export const MOST_VIEWED_MOVIES_FETCH_FAIL = 'MOST_VIEWED_MOVIES_FETCH_FAIL';

/**
 * Fetch movies ranked by popularity from the server. Popularity is determined by number of views and average rating
 * score. The current endpoint returns all movie and this may become a problem. It is better to provide a limit.
 * @param {function} dispatch
 * @returns {Promise}
 */
export const mostViewedMoviesFetch = () => (dispatch) => {
  return request.get('api/movies/popular')
    .then((res) => {
      return dispatch({
        type: MOST_VIEWED_MOVIES_FETCH_SUCCESS,
        payload: res.data
      });
    })
    .catch((error) => {
      return dispatch({
        type: MOST_VIEWED_MOVIES_FETCH_FAIL,
        error: error
      });
    });
};

export const movieSkip = (movieID) => {
  console.log('Skip a movie', movieID);
};

export const movieFetchByID = (movieID) => {
  console.log('Fetching movie', movieID);
};
