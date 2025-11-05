import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import carts from "./Cart/CartSlice";
import wishlist from "./Wishlist/WishlistSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["carts", "wishlist"],
};

const rootReducer = combineReducers({
  carts,
  wishlist,
});

// ✅ Fixed: Use persistReducer, not persistStore
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// ✅ Fixed: Pass persistedReducer to store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore redux-persist actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
