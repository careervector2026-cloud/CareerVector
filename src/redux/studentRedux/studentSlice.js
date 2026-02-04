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

// 1. Send OTP
export const sendOtp = createAsyncThunk(
  "student/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/student/send-otp", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send OTP.");
    }
  }
);

// 2. Signup
export const signupUser = createAsyncThunk(
  "student/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/student/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed.");
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
      return rejectWithValue(error.response?.data || "Login failed.");
    }
  }
);

// 4. Upload Profile Image
export const uploadProfileImage = createAsyncThunk(
  "student/uploadImage",
  async (formData, { rejectWithValue }) => {
    try {
      // Backend returns: { success: true, message: "...", url: "http://..." }
      const response = await axiosInstance.patch("/api/student/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Image upload failed.");
    }
  }
);

// 5. Upload Resume
export const uploadResume = createAsyncThunk(
  "student/uploadResume",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/api/student/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Resume upload failed.");
    }
  }
);

// 6. Update Profile Text Fields
export const updateStudentProfile = createAsyncThunk(
  "student/updateProfile",
  async (updatePayload, { rejectWithValue }) => {
    try {
      // Backend returns: { success: true, message: "...", student: { ...updatedStudentObj } }
      const response = await axiosInstance.patch("/api/student/profile", updatePayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed.");
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
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Signup
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state) => { 
        state.loading = false; 
        state.otpSent = false; 
        state.successMessage = "Account created successfully!"; 
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        sessionStorage.setItem("careerVectorStudent", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Image Upload
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.profileImageUrl = action.payload.url;
          sessionStorage.setItem("careerVectorStudent", JSON.stringify(state.currentUser));
        }
      })

      // Resume Upload
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.resumeUrl = action.payload.url;
          sessionStorage.setItem("careerVectorStudent", JSON.stringify(state.currentUser));
        }
      })

      // Update Text Profile
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        if (state.currentUser) {
          // If backend returns the full student object in 'student' key
          if (action.payload.student) {
            state.currentUser = action.payload.student;
          } else {
            // Fallback: merge payload if backend just sends changed fields (unlikely based on your code)
            state.currentUser = { ...state.currentUser, ...action.payload };
          }
          sessionStorage.setItem("careerVectorStudent", JSON.stringify(state.currentUser));
        }
      });
  },
});

export const { logoutStudent, clearErrors, resetSignupFlow } = studentSlice.actions;
export default studentSlice.reducer;