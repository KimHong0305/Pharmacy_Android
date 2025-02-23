import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import userReducer from './reducers/user.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
