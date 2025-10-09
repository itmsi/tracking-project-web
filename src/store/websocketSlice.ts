import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnlineUser {
  userId: string;
  userName: string;
  joinedAt?: string;
}

interface TypingUser {
  userId: string;
  userName: string;
}

interface WebSocketState {
  isConnected: boolean;
  reconnectAttempts: number;
  onlineUsers: OnlineUser[];
  typingUsers: TypingUser[];
  currentTaskId: string | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  reconnectAttempts: 0,
  onlineUsers: [],
  typingUsers: [],
  currentTaskId: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.reconnectAttempts = 0;
      }
    },
    setReconnectAttempts: (state, action: PayloadAction<number>) => {
      state.reconnectAttempts = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<OnlineUser>) => {
      const existingUserIndex = state.onlineUsers.findIndex(
        user => user.userId === action.payload.userId
      );
      if (existingUserIndex >= 0) {
        state.onlineUsers[existingUserIndex] = action.payload;
      } else {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        user => user.userId !== action.payload
      );
    },
    setTypingUsers: (state, action: PayloadAction<TypingUser[]>) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action: PayloadAction<TypingUser>) => {
      const existingUserIndex = state.typingUsers.findIndex(
        user => user.userId === action.payload.userId
      );
      if (existingUserIndex >= 0) {
        state.typingUsers[existingUserIndex] = action.payload;
      } else {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(
        user => user.userId !== action.payload
      );
    },
    setCurrentTaskId: (state, action: PayloadAction<string | null>) => {
      state.currentTaskId = action.payload;
    },
    clearWebSocketState: (state) => {
      state.onlineUsers = [];
      state.typingUsers = [];
      state.currentTaskId = null;
    },
  },
});

export const {
  setConnectionStatus,
  setReconnectAttempts,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setCurrentTaskId,
  clearWebSocketState,
} = websocketSlice.actions;

export default websocketSlice.reducer;
