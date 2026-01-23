import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

// Helper to load from Session Storage (Persists login across refreshes)
const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedData = sessionStorage.getItem("careerVectorRecruiter");
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
};

// 1. Send OTP
// Renamed to 'sendOtp' to match the import in RecruiterSignup.jsx
export const sendOtp = createAsyncThunk(
  "recruiter/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/recruiter/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send OTP.");
    }
  }
);

// 2. Signup (Verify & Save)
export const signupRecruiter = createAsyncThunk(
  "recruiter/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/recruiter/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed.");
    }
  }
);

// 3. Login
export const loginRecruiter = createAsyncThunk(
  "recruiter/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/recruiter/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Invalid Credentials");
    }
  }
);

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState: {
    currentRecruiter: loadFromStorage(),
    isAuthenticated: !!loadFromStorage(),
    loading: false,
    error: null,
    successMessage: null,
    otpSent: false, // Critical: Controls the switch between Form and OTP Input
  },
  reducers: {
    clearRecruiterErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    // This was the missing export causing your error
    resetSignupFlow: (state) => {
      state.otpSent = false;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },
    logoutRecruiter: (state) => {
        state.currentRecruiter = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.error = null;
        state.successMessage = null;
        sessionStorage.removeItem("careerVectorRecruiter");
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Send OTP ---
      .addCase(sendOtp.pending, (state) => { 
          state.loading = true; 
          state.error = null; 
      })
      .addCase(sendOtp.fulfilled, (state) => { 
          state.loading = false; 
          state.otpSent = true; // Triggers the UI to show OTP input
      })
      .addCase(sendOtp.rejected, (state, action) => { 
          state.loading = false; 
          state.error = action.payload; 
      })

      // --- Signup ---
      .addCase(signupRecruiter.pending, (state) => { 
          state.loading = true; 
          state.error = null; 
      })
      .addCase(signupRecruiter.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Account created successfully! Please Login."; 
        state.otpSent = false; 
      })
      .addCase(signupRecruiter.rejected, (state, action) => { 
          state.loading = false; 
          state.error = action.payload; 
      })

      // --- Login ---
      .addCase(loginRecruiter.pending, (state) => { 
          state.loading = true; 
          state.error = null; 
      })
      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentRecruiter = action.payload;
        state.error = null;
        sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(action.payload));
      })
      .addCase(loginRecruiter.rejected, (state, action) => { 
          state.loading = false; 
          state.error = action.payload; 
      });
  },
});

// Export all actions including resetSignupFlow
export const { clearRecruiterErrors, resetSignupFlow, logoutRecruiter } = recruiterSlice.actions;

export default recruiterSlice.reducer;