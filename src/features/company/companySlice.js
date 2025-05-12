import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCompany = createAsyncThunk(
  'company/fetchCompany',
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('access');
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found');
      }

      const response = await axios.get('https://api.noventer.uz/api/v1/company/get/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const companySlice = createSlice({
  name: 'company',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default companySlice.reducer;
