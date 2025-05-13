import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
    "users/registerUser",
    async (udata, { rejectWithValue }) => {
      try {
        const res = await axios.post("https://test-server-j0t3.onrender.com/registerUser", {
          fullName: udata.fullName,
          nationalId: udata.nationalId,
          email: udata.email,
          password: udata.password,
          profilepic: udata.profilepic,
          role: udata.role,
        });
  
        if (res.data.success) {
          return res.data;
        } else {
          return rejectWithValue(res.data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        return rejectWithValue(
          error.response?.data?.message || 
          error.response?.data?.error || 
          error.message || 
          "Registration failed"
        );
      }
    }
  );


  export const loginUser = createAsyncThunk(
    "users/loginUser",
    async (credentials) => {
      try {
        const res = await axios.post("https://test-server-j0t3.onrender.com/loginUser", credentials);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data;
      } catch (error) {
        throw error.response?.data || "Login failed";
      }
    }
  );


  // Add fetch and delete thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get("https://test-server-j0t3.onrender.com/users");
  return res.data;
});

export const deleteUserById = createAsyncThunk("users/deleteUser", async (id) => {
  await axios.delete(`https://test-server-j0t3.onrender.com/users/${id}`);
  return id;
});

  
const initStateVal = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  userList: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
}

export const userSlice = createSlice({
  name: "users",
  initialState: initStateVal,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      localStorage.removeItem('user');
    },
    logout: (state) => {
      state.user = null;
      state.isSuccess = false;
      localStorage.removeItem('user');
    }
  }, //sync operations
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })



      .addCase(fetchUsers.pending, state => { state.isLoading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUsers.rejected, state => { state.isLoading = false; })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.userList = state.userList.filter(u => u._id !== action.payload);
      });     
  }
  
});

export default userSlice.reducer;
export const { resetUserState, logout } = userSlice.actions;

//good jobe 