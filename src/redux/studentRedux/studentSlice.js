import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig";

// Helper to load from Session Storage
const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedData = sessionStorage.getItem("careerVectorStudent");
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
};

// --- Async Thunks ---

// 1. Send OTP (New)
export const sendOtp = createAsyncThunk(
  "student/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      // Backend expects: { "email": "..." }
      const response = await axiosInstance.post("/api/student/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  }
);

// 2. Signup (Verify OTP + Upload Data)
export const signupUser = createAsyncThunk(
  "student/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // formData includes fields + 'otp' + files
      const response = await axiosInstance.post("/api/student/signup", formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Check OTP or connection."
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
        error.response?.data?.message || "Login failed. Please try again."
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
  otpSent: false, // Controls UI switch in Signup
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
    // Reset signup state if user navigates away
    resetSignupFlow: (state) => {
      state.otpSent = false;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
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
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Signup (Verify & Save) ---
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = false;
        state.successMessage = "Account created successfully! Please Login.";
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Login ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.error = null;
        sessionStorage.setItem("careerVectorStudent", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutStudent, clearErrors, resetSignupFlow } = studentSlice.actions;
export default studentSlice.reducer;