import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/AxiosConfig"; 

// --- Helper: Load from Storage ---
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

// =================================================================
// ASYNC THUNKS
// =================================================================

// 1. Send OTP
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

// 2. Signup
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

// 4. Update Profile (Mobile, Company, Role)
export const updateRecruiterProfile = createAsyncThunk(
  "recruiter/updateProfile",
  async (updatePayload, { rejectWithValue }) => {
    try {
      // Endpoint: PATCH /api/recruiter/profile
      // Expecting backend to return the updated recruiter object or success status
      const response = await axiosInstance.patch("/api/recruiter/profile", updatePayload);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile update failed.");
    }
  }
);

// 5. Change Password
export const changePassword = createAsyncThunk(
  "recruiter/changePassword",
  async (passwordPayload, { rejectWithValue }) => {
    try {
      // Endpoint: PATCH /api/recruiter/change-password
      const response = await axiosInstance.patch("/api/recruiter/change-password", passwordPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password change failed.");
    }
  }
);

// 6. Upload Profile Picture
export const uploadRecruiterAvatar = createAsyncThunk(
  "recruiter/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      // Endpoint: PATCH /api/recruiter/upload-avatar
      // Backend should return { success: true, url: "..." }
      const response = await axiosInstance.patch("/api/recruiter/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Image upload failed.");
    }
  }
);

// =================================================================
// SLICE
// =================================================================

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
      // --- Send OTP ---
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Signup ---
      .addCase(signupRecruiter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupRecruiter.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Account created! Please Login."; 
        state.otpSent = false; 
      })
      .addCase(signupRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Login ---
      .addCase(loginRecruiter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentRecruiter = action.payload;
        sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(action.payload));
      })
      .addCase(loginRecruiter.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Update Profile (NEW) ---
      .addCase(updateRecruiterProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateRecruiterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Profile details updated successfully.";
        
        // Update state and session storage
        if (state.currentRecruiter) {
            // Merge existing data with payload (or meta arguments if backend returns minimal data)
            // Assuming backend returns the updated student object in 'student' or 'recruiter' key, or top level
            const updatedData = action.payload.recruiter || action.payload;
            
            // If backend doesn't return full object, we merge what we sent (action.meta.arg)
            // But ideally backend returns the updated object.
            state.currentRecruiter = { ...state.currentRecruiter, ...updatedData };
            sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(state.currentRecruiter));
        }
      })
      .addCase(updateRecruiterProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Change Password (NEW) ---
      .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(changePassword.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = "Password updated successfully."; 
      })
      .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // --- Upload Avatar (NEW) ---
      .addCase(uploadRecruiterAvatar.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadRecruiterAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Profile picture updated.";
        
        // Update image URL in Redux & Session
        if (state.currentRecruiter && action.payload.url) {
            state.currentRecruiter.imageUrl = action.payload.url;
            sessionStorage.setItem("careerVectorRecruiter", JSON.stringify(state.currentRecruiter));
        }
      })
      .addCase(uploadRecruiterAvatar.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logoutRecruiter, clearRecruiterErrors, resetSignupFlow } = recruiterSlice.actions;
export default recruiterSlice.reducer;