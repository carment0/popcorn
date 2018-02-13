/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

import { combineReducers } from 'redux';

import SessionErrorReducer from './session_error';

export default combineReducers({
  session: SessionErrorReducer,
});
