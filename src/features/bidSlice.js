import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action to place a bid
export const placeBid = createAsyncThunk(
  'bids/placeBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('https://test-server-j0t3.onrender.com/addBid', bidData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Action to get bids for a product
export const getBids = createAsyncThunk(
  'bids/getBids',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://test-server-j0t3.onrender.com/getBids/${productId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  bidList: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    resetBidState: (state) => {
      return { ...initialState, bidList: state.bidList };
    },
    clearBids: (state) => {
      state.bidList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Place Bid
      .addCase(placeBid.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Bid placed successfully';
        state.bidList.unshift(action.payload);
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to place bid';
      })
      
      // Get Bids
      .addCase(getBids.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bidList = action.payload;
        state.isSuccess = true;
      })
      .addCase(getBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch bids';
      });
  },
});

export const { resetBidState, clearBids } = bidSlice.actions;
export default bidSlice.reducer;