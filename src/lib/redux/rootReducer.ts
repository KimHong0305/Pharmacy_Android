import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import userReducer from './reducers/user.reducer';
import homeReducer from './reducers/home.reducer';
import productReducer from './reducers/product.reducer';
import cartReducer from './reducers/cart.reducer';
import orderReducer from './reducers/order.reducer';
import categoryReducer from './reducers/category.reducer';
import addressReducer from './reducers/address.reducer';
import couponReducer from './reducers/coupon.reducer';
import locationReducer from './reducers/location.reducer';
import feedbackReducer from './reducers/feedback.reducer';
import whistlistReducer from './reducers/whistlist.reducer';
import statisticReducer from './reducers/statistic.reducer';
import deliveryReducer from './reducers/delivery.reducer';
import paymentReducer from './reducers/payment.reducer';
import nurseReducer from './reducers/nurse.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  home: homeReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  category: categoryReducer,
  address: addressReducer,
  coupon: couponReducer,
  location: locationReducer,
  feedback: feedbackReducer,
  whistlist: whistlistReducer,
  statistic: statisticReducer,
  delivery: deliveryReducer,
  payment: paymentReducer,
  nurse: nurseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
