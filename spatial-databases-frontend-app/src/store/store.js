import { configureStore } from '@reduxjs/toolkit';
import routesReducer from './slices/routesSlice';
import poisReducer from './slices/poisSlice';

export const store = configureStore({
  reducer: {
    routes: routesReducer,
    pois: poisReducer,
  },
});