/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request    from 'axios';


export const MOVIE_DETAIL_FETCH_SUCCESS = 'MOVIE_DETAIL_FETCH_SUCCESS';
export const MOVIE_DETAIL_FETCH_FAIL = 'MOVIE_DETAIL_FETCH_FAIL';

/**
 * Fetch metadata of a movie by imdb ID using the movie database endpoint
 * @param {string} imdbId
 */
export const movieDetailFetch = (imdbId) => (dispatch) => {
  const config = {
    params: {
      api_key: '2afddf218bfb5d06ef460cc103af69bc'
    }
  };

  return request.get(`https://api.themoviedb.org/3/movie/${imdbId}`, config)
    .then((res) => {
      return dispatch({
        type: MOVIE_DETAIL_FETCH_SUCCESS,
        payload: res.data
      });
    })
    .catch((error) => {
      return dispatch({ type: MOVIE_DETAIL_FETCH_FAIL, error, imdbId });
    });
};
