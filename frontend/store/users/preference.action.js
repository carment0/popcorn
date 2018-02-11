/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import request from 'axios';


export const USER_PREFERENCE_FETCH_START = 'USER_PREFERENCE_FETCH_START';
export const USER_PREFERENCE_FETCH_SUCCESS = 'USER_PREFERENCE_FETCH_SUCCESS';
export const USER_PREFERENCE_FETCH_FAIL = 'USER_PREFERENCE_FETCH_FAIL';

const userPreferenceFetchStart = () => ({ type: USER_PREFERENCE_FETCH_START });


const userPreferenceFetchSuccess = (data) => {
  return {
    type: USER_PREFERENCE_FETCH_SUCCESS,
    preferenceVector: data.preference_vector
  };
};

const userPreferenceFetchFail = (error) => {
  return {
    type: USER_PREFERENCE_FETCH_FAIL,
    error
  };
};

export const userPreferenceFetch = (movieRatings) => (dispatch) => {
  dispatch(userPreferenceFetchStart());

  const payload = {
    movie_ratings: movieRatings
  };

  return request.post('api/users/preference', payload)
    .then((res) => {
      return dispatch(userPreferenceFetchSuccess(res.data));
    })
    .catch((error) => {
      return dispatch(userPreferenceFetchFail(error));
    });
};
