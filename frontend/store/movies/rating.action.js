/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request from 'axios';

export const MOVIE_RATINGS_FETCH_SUCCESS = 'MOVIE_RATINGS_FETCH_SUCCESS';
export const MOVIE_RATINGS_FETCH_FAIL = 'MOVIE_RATINGS_FETCH_FAIL';

/**
 * Make a GET request to server to get the list of ratings that user has previously submitted.
 * @param {number} userId
 */
export const movieRatingsFetch = (userId) => (dispatch) => {
  return request.get(`api/users/${userId}/ratings`).then((res) => {
    return dispatch({
      type: MOVIE_RATINGS_FETCH_SUCCESS,
      payloads: res.data
    });
  }).catch((error) => dispatch({ type: MOVIE_RATINGS_FETCH_FAIL, error }));
};


export const MOVIE_RATING_POST_SUCCESS = 'MOVIE_RATING_POST_SUCCESS';
export const MOVIE_RATING_POST_FAIL = 'MOVIE_RATING_POST_FAIL';

/**
 * Make a POST request to server to save a movie rating submitted by current user.
 * @param {number} movieId
 * @param {number} userId
 * @param {number} value Rating value, e.g. 1.5, 2.0, and etc...
 */
export const movieRatingPost = (movieId, userId, value) => (dispatch) => {
  const payload = {
    movie_id: movieId,
    user_id: userId,
    rating: value
  };

  return request.post('api/ratings', payload).then(() => {
    return dispatch({
      type: MOVIE_RATING_POST_SUCCESS, movieId, value
    });
  }).catch((error) => dispatch({ type: MOVIE_RATING_POST_FAIL, error }));
};

export const MOVIE_RATING_RECORDED = 'MOVIE_RATING_RECORDED';

/**
 * Record a rating submitted by annoymouse user and cache it in Redux store.
 * @param {number} movieId
 * @param {number} value Rating value, e.g. 1.5, 2.0, and etc...
 */
export const movieRatingRecord = (movieId, value) => (dispatch) => {
  return dispatch({
    type: MOVIE_RATING_RECORDED, movieId, value
  });
};
