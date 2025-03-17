import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import userReducer from './reducers/user.reducer';
import homeReducer from './reducers/home.reducer';
import productReducer from './reducers/product.reducer';
import cartReducer from './reducers/cart.reducer';
import orderReducer from './reducers/order.reducer';
import categoryReducer from './reducers/category.reducer';
import addressReducer from './reducers/address.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  home: homeReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  category: categoryReducer,
  address: addressReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
