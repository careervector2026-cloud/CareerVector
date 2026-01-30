import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const savedData = sessionStorage.getItem("careerVectorRecruiter");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      console.error("Error parsing recruiter data", e);
      return null;
    }
  }
  return null;
};

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
    otpSent: false,
  },
  reducers: {
    logoutRecruiter: (state) => {
      state.currentRecruiter = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.otpSent = false;
      sessionStorage.removeItem("careerVectorRecruiter");
    },
    clearRecruiterErrors: (state) => {
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
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(signupRecruiter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupRecruiter.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Account created! Please Login."; 
        state.otpSent = false; 
      })
      .addCase(signupRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loginRecruiter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentRecruiter = action.payload;
        sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(action.payload));
      })
      .addCase(loginRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logoutRecruiter, clearRecruiterErrors, resetSignupFlow } = recruiterSlice.actions;
export default recruiterSlice.reducer;