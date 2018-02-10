/**
 * @copyright Consilium, 2017
 * @author Carmen To
 */

import { RECEIVE_SESSION_ERRORS } from './session.action';

export default (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return [].concat(action.errors);

    default:
      return state;
  }
};
