// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminRedux/adminSlice';
import recruiterReducer from './recruiterRedux/recruiterSlice';
import studentReducer from './studentRedux/studentSlice';

export const store = configureStore({
  reducer: {
    // These keys must match the 'roleType' prop you pass in MainRouter
    admin: adminReducer,
    recruiter: recruiterReducer,
    student: studentReducer,
  },
});