import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialState: {
    list: [], /* routesList */
    routesListStatus: 'idle', /* idle | loading | succeded | failed */
    routesListError: null,
    selectedRoute: null, /* routeDetail */
    routeDetailStatus: 'idle',
    routeDetailError: null,
  }
};

// Загрузка списка маршрутов
export const fetchRoutesList = createAsyncThunk(
  'routes/fetchRoutesList',
  async (cityId, { rejectWithValue}) => {
    try {
      const response = await fetch(`/api/routes?cityId=${cityId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch routes');
    }    
  }
);

// Загрузка деталей маршрута
export const fetchRouteDetail = createAsyncThunk(
  'routes/fetchRouteDetail',
  async (routeId, { rejectWithValue}) => {
    try {
      const response = await fetch(`/api/routes/${routeId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch routes');
    }
  }
);

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.
      addCase(fetchRoutesList.pending, (state) => {
        state.routesListStatus = 'loading';
        state.routesListError = null;
      })
      .addCase(fetchRoutesList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.routesListError = null;
        state.routesListStatus = 'succeeded';
      })
      .addCase(fetchRoutesList.rejected, (state, action) => {
        state.routesListStatus = 'failed';
        state.routesListError = action.payload.errorMessage;
        state.list = [];
      })
      .addCase(fetchRouteDetail.pending, (state) => {
        state.routeDetailStatus = 'loading';
        state.routeDetailError = null;
      })
      .addCase(fetchRouteDetail.fulfilled, (state, action) => {
        state.selectedRoute = action.payload;
        state.routeDetailError = null;
        state.routeDetailStatus = 'succeeded';
      })
      .addCase(fetchRouteDetail.rejected, (state, action) => {
        state.routeDetailStatus = 'failed';
        state.routeDetailError = action.payload.errorMessage;
        state.selectedRoute = null;
      });
  }
});

//export const { login, logout } = userSlice.actions;
export default routesSlice.reducer;