import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"


interface ResultData {
  plan: number[][];
  objectiveValue: number;
}

export interface ResultState {
  result: ResultData;
  objective: 'minimize' | 'maximize';
}

const initialState: ResultState = {
  result: {
    plan: [],
    objectiveValue: 0,
  },
  objective: 'minimize'
};

export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<{ result: ResultData; objective: 'minimize' | 'maximize' }>) => {
      state.result = action.payload.result; //Directly update the result using Immer
      state.objective = action.payload.objective; //Directly update the objective
    },
  },
});

export const { setResult } = resultSlice.actions;

export default resultSlice.reducer;
