/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

import { LOGIN_FAIL, LOGOUT_FAIL, SIGNUP_FAIL, CLEAR_SESSION_ERRORS } from '../users/session.action';

export default (state = [], action) => {
  Object.freeze(state);

  switch (action.type) {
    case LOGIN_FAIL:
    case LOGOUT_FAIL:
    case SIGNUP_FAIL:
      return [action.error];

    case CLEAR_SESSION_ERRORS:
      return [];

    default:
      return state;
  }
};
