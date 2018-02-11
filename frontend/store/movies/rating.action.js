/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request from 'axios';


export const RATING_POST_SUCCESS = 'RATING_POST_SUCCESS';
export const RATING_POST_FAIL = 'RATING_POST_FAIL';

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
    value: value
  };

  return request.post('api/ratings/', payload).then((res) => {
    return dispatch({
      type: RATING_POST_SUCCESS,
      payload: res.data
    });
  }).catch((error) => {
    return dispatch({
      type: RATING_POST_FAIL,
      error: error
    });
  });
};
