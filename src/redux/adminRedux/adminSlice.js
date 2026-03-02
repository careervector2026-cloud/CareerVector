import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const savedData = sessionStorage.getItem("careerVectorAdmin");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 1. Send OTP
export const sendAdminOtp = createAsyncThunk("admin/sendOtp", async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/admin/send-otp", { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to send OTP.");
  }
});

// 2. Signup
export const signupAdmin = createAsyncThunk("admin/signup", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/admin/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Signup failed.");
  }
});

// 3. Login
export const loginAdmin = createAsyncThunk("admin/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/admin/login", credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Invalid Credentials");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: loadFromStorage(),
    isAuthenticated: !!loadFromStorage(),
    loading: false,
    error: null,
    successMessage: null,
    otpSent: false,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.currentAdmin = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      sessionStorage.removeItem("careerVectorAdmin");
    },
    clearAdminErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetSignupFlow: (state) => {
      state.otpSent = false;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendAdminOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(sendAdminOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(signupAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupAdmin.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Account created successfully! Please Login."; 
        state.otpSent = false; 
      })
      .addCase(signupAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentAdmin = action.payload;
        sessionStorage.setItem("careerVectorAdmin", JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { logoutAdmin, clearAdminErrors, resetSignupFlow } = adminSlice.actions;
export default adminSlice.reducer;