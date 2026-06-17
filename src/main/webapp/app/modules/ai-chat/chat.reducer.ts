import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  sessionId: null as number | null,
  messages: [] as { role: 'user' | 'assistant'; content: string; recommendedProductIds?: number[] }[],
};

export type ChatState = Readonly<typeof initialState>;

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ sessionId, message }: { sessionId: number | null; message: string }) => {
    const requestBody = { sessionId, message };
    const response = await axios.post<any>('/api/ai-chats/message', requestBody);
    return response.data; // { sessionId, content, recommendedProductIds }
  },
  { serializeError: serializeAxiosError },
);

export const AiChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChat(state) {
      state.sessionId = null;
      state.messages = [];
      state.loading = false;
      state.errorMessage = null;
    },
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({ role: 'user', content: action.payload });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(sendMessage.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
        // Optionally add a system error message
        state.messages.push({ role: 'assistant', content: 'Xin lỗi, đã xảy ra lỗi trong quá trình kết nối tới AI. Vui lòng thử lại!' });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;

        // Parse recommendedProductIds from comma-separated string to array of numbers
        let productIds: number[] = [];
        if (action.payload.recommendedProductIds && action.payload.recommendedProductIds.length > 0) {
          // Note: In backend we returned List<Long> recommendedProductIds, so it's already an array!
          productIds = action.payload.recommendedProductIds;
        }

        state.messages.push({
          role: 'assistant',
          content: action.payload.content,
          recommendedProductIds: productIds.length > 0 ? productIds : undefined,
        });
      });
  },
});

export const { resetChat, addUserMessage } = AiChatSlice.actions;

export default AiChatSlice.reducer;
