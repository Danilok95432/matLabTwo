import { configureStore } from '@reduxjs/toolkit'
import resultReducer from './result'

export const store = configureStore({
  reducer: {
    result: resultReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
