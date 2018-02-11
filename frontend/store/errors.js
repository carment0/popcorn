/**
 * @copyright Popcorn, 2018
 * @author Carmen To
 */

import { combineReducers } from 'redux';

import SessionErrorReducer from './users/errors.reducer';

export default combineReducers({
  session: SessionErrorReducer,
});
