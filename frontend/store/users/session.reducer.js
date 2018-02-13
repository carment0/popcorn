/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

import { LOGIN_SUCCESS, SIGNUP_SUCCESS, LOGOUT_SUCCESS } from './session.action';

const _nullUser = Object.freeze({ currentUser: null });

const SessionReducer = (state = _nullUser, action) => {
  Object.freeze(state);
  switch (action.type) {
    case LOGIN_SUCCESS:
    case LOGOUT_SUCCESS:
    case SIGNUP_SUCCESS:
      const currentUser = action.currentUser;
      return Object.assign({}, { currentUser });

    default:
      return state;
  }
};

export default SessionReducer;
