import { combineReducers } from 'redux';

import SessionErrorReducer from './users/errors.reducer';


export default combineReducers({
  session: SessionErrorReducer,
});
