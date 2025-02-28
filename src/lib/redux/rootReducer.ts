import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import userReducer from './reducers/user.reducer';
import productReducer from './reducers/product.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
