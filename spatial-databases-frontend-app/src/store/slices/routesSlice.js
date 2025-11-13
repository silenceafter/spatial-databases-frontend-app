import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialState: {
    routes: [],
    loading: false,
    error: null,
  }
};

export const fetchData = createAsyncThunk(
  'routes/fetchData',
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

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.routes = action.payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.errorMessage;
      state.routes = [];
    });
  }
});

//export const { login, logout } = userSlice.actions;
export default routesSlice.reducer;