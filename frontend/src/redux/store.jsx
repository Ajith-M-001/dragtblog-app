import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import apiSlice from "./api/apiSlice";
import notificationReducer from "./slices/notificationSlice";

const userPersistConfig = {
  key: "user",
  storage,
  version: 1,
  blacklist: ["error", "isLoading"],
};

// const cartPersistConfig = {
//   key: "cart",
//   storage,
//   version: 1,
//   blacklist: ["loading"],
// };

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// const persistedCartReducer = persistReducer(cartPersistConfig, cardReducer);

const rootReducer = combineReducers({
  user: persistedUserReducer,
  Notification: notificationReducer,
  // cart: persistedCartReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_CURRENT_ENVIRONMENT !== "production",
});

export const persistor = persistStore(store);
