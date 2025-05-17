import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Convert imageGallery array to string if it exists
      const dataToSend = {
        ...productData,
        imageGallery: productData.imageGallery?.join(',') || ''
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addProduct`,
        dataToSend
      );
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to create product');
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to create product'
      );
    }
  }
);


export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProducts`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProductDetails/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'products/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`);
      if (response.data.success) {
        return response.data.stats;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error('Dashboard stats error:', err);
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to fetch dashboard statistics'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    productList: [],
    isLoading:   false,
    isSuccess:   false,
    isError:     false,
    message:     '',
    currentProduct: null,
    dashboardStats: {
      totalUsers: 0,
      activeAuctions: 0,
      totalBids: 0,
      totalRevenue: 0
    }
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.currentProduct = action.payload.product;
        state.productList = [...state.productList, action.payload.product];
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
        state.isSuccess = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(getProductDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload; // Store product details in state
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
