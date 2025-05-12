
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from '../features/company/companySlice';

const store = configureStore({
  reducer: {
    company: companyReducer,
  },
});

export default store;

