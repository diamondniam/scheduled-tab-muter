import type { TimeView } from "@mui/x-date-pickers/models";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type MainState = {
  step: number;
  from: string | null;
  to: string | null;
  domains: string[];
  clock: {
    view: TimeView;
    currentClock: "from" | "to";
  };
  browserStorage: Record<string, any>;
};

type SetActionPayload =
  | { name: "from"; data: string | null }
  | { name: "to"; data: string | null }
  | { name: "step"; data: number }
  | { name: "domains"; data: string[] }
  | { name: "clock"; data: { view: TimeView; currentClock: "from" | "to" } };

type PushActionPayload = { name: "domains"; data: string };
type SpliceActionPayload = { name: "domains"; data: number };

const initialState: MainState = {
  step: 1,
  from: null,
  to: null,
  domains: [],
  clock: {
    view: "hours",
    currentClock: "from",
  },
  browserStorage: {},
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<SetActionPayload>) => {
      switch (action.payload.name) {
        case "from":
        case "to":
          state[action.payload.name] = action.payload.data;
          break;
        case "step":
          state.step = action.payload.data;
          break;
        case "domains":
          state.domains = action.payload.data;
          break;
        case "clock":
          state.clock = action.payload.data;
          break;
      }
    },
    push: (state, action: PayloadAction<PushActionPayload>) => {
      switch (action.payload.name) {
        case "domains":
          state.domains.push(action.payload.data);
          break;
      }
    },
    splice: (state, action: PayloadAction<SpliceActionPayload>) => {
      switch (action.payload.name) {
        case "domains":
          state.domains.splice(action.payload.data, 1);
          break;
      }
    },
    setBrowserStorage: (
      state,
      action: PayloadAction<{ name: string; data: any }>
    ) => {
      state.browserStorage[action.payload.name] = action.payload.data;
    },
  },
});

export const { set, push, splice, setBrowserStorage } = mainSlice.actions;
export default mainSlice.reducer;
