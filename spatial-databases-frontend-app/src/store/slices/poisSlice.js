import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialState: {
    list: [], 
    poisListStatus: 'idle', /* idle | loading | succeded | failed */
    poisListError: null,
  }
};

// Загрузка списка точек
export const fetchPoisList = createAsyncThunk(
  'routes/fetchPoisList',
  async ({categories, limit}, { rejectWithValue}) => {
    try {
      const params = new URLSearchParams();
      categories.forEach(c => {
        if (c) {
            params.append('categories', c);
        }});
      params.append('limit', limit);

      const response = await fetch(`/api/pointsofinterest?${params.toString()}`);
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

const poisSlice = createSlice({
  name: 'pois',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.
      addCase(fetchPoisList.pending, (state) => {
        state.poisListStatus = 'loading';
        state.poisListError = null;
      })
      .addCase(fetchPoisList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.poisListError = null;
        state.poisListStatus = 'succeeded';
      })
      .addCase(fetchPoisList.rejected, (state, action) => {
        state.poisListStatus = 'failed';
        state.poisListError = action.error.message;
        state.list = [];
      });
  }
});

export default poisSlice.reducer;