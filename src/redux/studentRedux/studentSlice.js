import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

// Helper to load from Session Storage safely
const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const savedData = sessionStorage.getItem("careerVectorStudent");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      console.error("Error parsing user data", e);
      return null;
    }
  }
  return null;
};

// --- Async Thunks ---

// 1. Send OTP (Used for Signup)
export const sendOtp = createAsyncThunk(
  "student/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/student/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send OTP. Please try again."
      );
    }
  }
);

// 2. Signup
export const signupUser = createAsyncThunk(
  "student/signup",
  async (formData, { rejectWithValue }) => {
    try {
      // Axios handles Content-Type: multipart/form-data automatically with FormData object
      const response = await axiosInstance.post("/api/student/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Signup failed. Check OTP or connection."
      );
    }
  }
);

// 3. Login
export const loginUser = createAsyncThunk(
  "student/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/student/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Login failed. Please check your credentials."
      );
    }
  }
);

const initialState = {
  currentUser: loadFromStorage(),
  isAuthenticated: !!loadFromStorage(),
  loading: false,
  error: null,
  successMessage: null,
  otpSent: false,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    logoutStudent: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.otpSent = false;
      sessionStorage.removeItem("careerVectorStudent");
    },
    clearErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetSignupFlow: (state) => {
      state.otpSent = false;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; state.error = null; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Signup
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state) => { 
        state.loading = false; 
        state.otpSent = false; 
        state.successMessage = "Account created successfully! Please Login."; 
        state.error = null; 
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.error = null;
        sessionStorage.setItem("careerVectorStudent", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logoutStudent, clearErrors, resetSignupFlow } = studentSlice.actions;
export default studentSlice.reducer;