import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
  successMessage: null as string | null,
};

export type PasswordResetState = Readonly<typeof initialState>;

const apiUrl = 'api/account/reset-password';
// Actions

export const handlePasswordResetInit = createAsyncThunk(
  'passwordReset/reset_password_init',
  async (mail: string) => axios.post(`${apiUrl}/init`, { mail }),
  { serializeError: serializeAxiosError },
);

export const handlePasswordResetFinish = createAsyncThunk(
  'passwordReset/reset_password_finish',
  async (data: { key: string; newPassword: string }) => axios.post(`${apiUrl}/finish`, data),
  { serializeError: serializeAxiosError },
);

export const PasswordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: initialState as PasswordResetState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handlePasswordResetInit.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
        successMessage: 'reset.request.messages.success',
      }))
      .addCase(handlePasswordResetFinish.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
        successMessage: 'reset.finish.messages.success',
      }))
      .addMatcher(isPending(handlePasswordResetInit, handlePasswordResetFinish), state => {
        state.loading = true;
      })
      .addMatcher(isRejected(handlePasswordResetInit, handlePasswordResetFinish), () => ({
        ...initialState,
        loading: false,
        resetPasswordFailure: true,
      }));
  },
});

export const { reset } = PasswordResetSlice.actions;

// Reducer
export default PasswordResetSlice.reducer;
