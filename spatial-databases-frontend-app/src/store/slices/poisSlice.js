import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialState: {
    list: [], 
    poisListStatus: 'idle', /* idle | loading | succeded | failed */
    poisListError: null,
    searchByNameList: [], 
    searchByNameListStatus: 'idle', /* idle | loading | succeded | failed */
    searchByNameError: null,
    geometry: [], /* poisGeometry */
    geometryStatus: 'idle',
    geometryError: null,
  }
};

// Загрузка списка точек
export const fetchPoisList = createAsyncThunk(
  'pois/fetchPoisList',
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
      return rejectWithValue(error.message || 'Failed to fetch pois');
    }    
  }
);

// Загрузка списка точек
export const fetchSearchByNameList = createAsyncThunk(
  'pois/fetchSearchByNameList',
  async ({search, limit}, { rejectWithValue}) => {
    try {
      const params = new URLSearchParams();
      params.append('query', search);
      params.append('limit', limit);

      const response = await fetch(`/api/pointsofinterest/search?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pois');
    }    
  }
);

// Пешеходный маршрут на основе выбранных точек
export const fetchPoisGeometry = createAsyncThunk(
  'pois/fetchPoisGeometry',
  async (stops, { rejectWithValue }) => {
    try {
      const coords = stops.map(([lon, lat]) => `${lon},${lat}`).join(';');
      const response = await fetch(`https://router.project-osrm.org/route/v1/foot/${coords}?geometries=geojson&overview=simplified&annotations=true`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pois');
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
      })
      .addCase(fetchSearchByNameList.pending, (state) => {
        state.searchByNameListStatus = 'loading';
        state.searchByNameError = null;
      })
      .addCase(fetchSearchByNameList.fulfilled, (state, action) => {
        state.searchByNameList = action.payload;
        state.searchByNameError = null;
        state.searchByNameListStatus = 'succeeded';
      })
      .addCase(fetchSearchByNameList.rejected, (state, action) => {
        state.searchByNameListStatus = 'failed';
        state.searchByNameError = action.error.message;
        state.searchByNameList = [];
      })
      .addCase(fetchPoisGeometry.pending, (state) => {
        state.geometryStatus = 'loading';
        state.geometryError = null;
      })
      .addCase(fetchPoisGeometry.fulfilled, (state, action) => {
        const fixedPath = action.payload.routes[0].geometry.coordinates.map(([lat, lon]) => [lon, lat]);
        state.geometry = fixedPath;
        state.geometryError = null;
        state.geometryStatus = 'succeeded';
      })
      .addCase(fetchPoisGeometry.rejected, (state, action) => {
        state.geometryStatus = 'failed';
        state.geometryError = action.payload.errorMessage;
        state.geometry = null;
      });
  }
});

export default poisSlice.reducer;