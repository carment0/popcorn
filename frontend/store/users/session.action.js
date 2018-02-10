/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

import request from 'axios';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';

export const receiveCurrentUser = (currentUser) => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const clearSessionErrors = () => ({
  type: RECEIVE_SESSION_ERRORS,
  errors: []
});

export const signup = (user) => (dispatch) => {
  return request.post('api/users/register', user).then((res) => {
    return dispatch(receiveCurrentUser(res));
  }).catch((error) => {
    return dispatch(receiveErrors(error));
  });
};

export const login = (user) => (dispatch) => {
  return request.post('api/users/login', user).then((res) => {
    const userInfo = res.data;
    return dispatch(receiveCurrentUser(userInfo));
  }).catch((error) => {
    return dispatch(receiveErrors(error));
  });
};

export const logout = () => (dispatch) => {
  return request.delete('api/users/logout').then(() => (
    dispatch(receiveCurrentUser(null))
  ));
};
