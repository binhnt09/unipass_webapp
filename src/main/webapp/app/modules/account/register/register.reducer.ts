import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null as string | null | undefined,
  successMessage: null as string | null | undefined,
  universities: [] as any[],
};

export type RegisterState = Readonly<typeof initialState>;

// Actions

export const handleRegister = createAsyncThunk(
  'register/create_account',
  async (data: {
    login: string;
    email: string;
    password: string;
    langKey?: string;
    firstName: string;
    lastName: string;
    studentIdNumber: string;
    universityId: number;
  }) => axios.post<any>('api/register', data),
  { serializeError: serializeAxiosError },
);

export const fetchUniversities = createAsyncThunk('register/fetch_universities', async () => axios.get<any[]>('api/universities'), {
  serializeError: serializeAxiosError,
});

export const RegisterSlice = createSlice({
  name: 'register',
  initialState: initialState as RegisterState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handleRegister.pending, state => {
        state.loading = true;
      })
      .addCase(handleRegister.rejected, (state, action) => ({
        ...initialState,
        registrationFailure: true,
        errorMessage: action.error.message,
      }))
      .addCase(handleRegister.fulfilled, () => ({
        ...initialState,
        registrationSuccess: true,
        successMessage: 'register.messages.success',
      }))
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.universities = action.payload.data;
      });
  },
});

export const { reset } = RegisterSlice.actions;

// Reducer
export default RegisterSlice.reducer;
