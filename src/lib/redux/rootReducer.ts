import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import userReducer from './reducers/user.reducer';
import homeReducer from './reducers/home.reducer';
import productReducer from './reducers/product.reducer';
import orderReducer from './reducers/order.reducer';
import categoryReducer from './reducers/category.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  home: homeReducer,
  product: productReducer,
  order: orderReducer,
  category: categoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
