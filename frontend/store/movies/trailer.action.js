/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request    from 'axios';


export const MOVIE_TRAILER_FETCH_SUCCESS = 'MOVIE_TRAILER_FETCH_SUCCESS';
export const MOVIE_TRAILER_FETCH_FAIL = 'MOVIE_TRAILER_FETCH_FAIL';

/**
 * Fetch movie trailers by imdb ID using the movie database endpoint
 * @param {string} imdbId
 */
export const movieTrailerFetch = (imdbId) => (dispatch) => {
  return request.get('api/movies/trailers/' + imdbId)
    .then((res) => {
      return dispatch({
        type: MOVIE_TRAILER_FETCH_SUCCESS,
        payload: res.data,
        imdbId: imdbId
      });
    })
    .catch((error) => {
      return dispatch({ type: MOVIE_TRAILER_FETCH_FAIL, error, imdbId });
    });
};
