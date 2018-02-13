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
  const config = {
    params: {
      api_key: '2afddf218bfb5d06ef460cc103af69bc'
    }
  };

  return request.get(`https://api.themoviedb.org/3/movie/${imdbId}/videos`, config)
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
