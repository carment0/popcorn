/**
 * @copyright Consilium, 2017
 * @author Carmen To
 */

import { RECEIVE_CURRENT_USER } from './session.action';

const _nullUser = Object.freeze({ currentUser: null });

const SessionsReducer = (state = _nullUser, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      const currentUser = action.currentUser;
      return Object.assign({}, { currentUser });

    default:
      return state;
  }
};

export default SessionsReducer;
