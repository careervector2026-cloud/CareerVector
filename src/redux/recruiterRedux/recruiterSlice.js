import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

// 1. Send OTP
export const sendRecruiterOtp = createAsyncThunk(
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
    currentRecruiter: null,
    tempSignupData: null, // Holds form data between pages
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setTempSignupData: (state, action) => {
      state.tempSignupData = action.payload; // Save data
      state.error = null;
    },
    clearRecruiterErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    logoutRecruiter: (state) => {
        state.currentRecruiter = null;
        state.isAuthenticated = false;
        sessionStorage.removeItem("careerVectorRecruiter");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRecruiterOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendRecruiterOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(sendRecruiterOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(signupRecruiter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupRecruiter.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Account Verified!"; 
        state.tempSignupData = null; // Clear temp data
      })
      .addCase(signupRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentRecruiter = action.payload;
        sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(action.payload));
      })
      .addCase(loginRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setTempSignupData, clearRecruiterErrors, logoutRecruiter } = recruiterSlice.actions;
export default recruiterSlice.reducer;