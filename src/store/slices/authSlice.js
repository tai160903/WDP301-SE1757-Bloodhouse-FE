import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../api/authAPI';

// Initial state
const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signUp(userData);
      // Backend response structure: { message, data: { user, tokens } }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.signIn(credentials);
      // Backend response structure: { message, data: { user, tokens } }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const accessToken = state.auth.tokens?.accessToken;
      
      if (accessToken) {
        await authAPI.signOut(accessToken);
      }
      // Backend returns { message: "Logout successfull" } but we don't need it
      return {};
    } catch (error) {
      // Even if logout API fails, we still want to clear local state
      return {};
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.tokens?.refreshToken;
      const userId = state.auth.user?._id;
      
      if (!refreshToken || !userId) {
        throw new Error('No refresh token available');
      }
      
      const response = await authAPI.refreshToken({
        userId,
        refreshToken,
      });
      // Backend response structure: { message, data: { user, tokens } }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state) => {
        // Clear state even if API call fails
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // On refresh token failure, clear auth state
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth, updateUser } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectTokens = (state) => state.auth.tokens;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Helper selectors based on backend user structure
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserFacilityId = (state) => state.auth.user?.facilityId;
export const selectUserPosition = (state) => state.auth.user?.position;
export const selectUserFacilityName = (state) => state.auth.user?.facilityName;

// Role-based selectors matching backend USER_ROLE enum
export const selectIsStaff = (state) => {
  const role = state.auth.user?.role;
  return ['MANAGER', 'DOCTOR', 'NURSE', 'TRANSPORTER'].includes(role);
};
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectIsManager = (state) => state.auth.user?.role === 'MANAGER';
export const selectIsDoctor = (state) => state.auth.user?.role === 'DOCTOR';
export const selectIsNurse = (state) => state.auth.user?.role === 'NURSE';
export const selectIsTransporter = (state) => state.auth.user?.role === 'TRANSPORTER';
export const selectIsMember = (state) => state.auth.user?.role === 'MEMBER';

export default authSlice.reducer; 