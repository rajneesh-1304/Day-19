import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import usersReducer from "./features/users/userSlice";
import productReducer from './features/products/productSlice'
import searchReducer from './features/search/searchSlice'
import imageReducer from './features/imageSlice';
import couponReducer from './features/couponSlice'

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users"], 
};

const rootReducer = combineReducers({
  users: usersReducer,
  products: productReducer,
  search:searchReducer,
  image: imageReducer,
  coupon: couponReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
