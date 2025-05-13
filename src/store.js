import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/UserSlice';
import productReducer from './features/ProductSlice';
import bidReducer from './features/bidSlice';
const store = configureStore({
  reducer: {
    users: userReducer,
    bids: bidReducer,
    products: productReducer,
  },
});

export default store;
