import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UIState {
  notification: string | null;
}

const initialState: UIState = {
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<string | null>) => {
      state.notification = action.payload;
    },
  },
});

export const { setNotification } = uiSlice.actions;

export const selectNotification = (state: RootState) => state.ui.notification;

export default uiSlice.reducer;
