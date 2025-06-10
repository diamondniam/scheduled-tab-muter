import { configureStore } from "@reduxjs/toolkit";
import main from "./main"; // your slice file

export const store = configureStore({
  reducer: {
    main,
  },
});

// Infer types for usage in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
