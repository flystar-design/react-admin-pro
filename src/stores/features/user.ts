import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAccessTokenAPI,
  logoutAPI,
  ajaxGetUserInfo
} from '@/services/api/login';

export interface UserInfo {
  userName: string;
}

export type User = {
  info?: UserInfo;
};

const initialState: User = {
  info: undefined
};
/**
 * 登录
 */
export const loginHandle = createAsyncThunk<
  UserInfo | false,
  { code: string; codeVerifier: string }
>('user/login', async (params) => {
  const result = await getAccessTokenAPI(params);
  if (result.status === 200) {
    return result.data;
  }
  return false;
});

/**
 * 登出
 */
export const logoutHandle = createAsyncThunk<boolean>(
  'user/logout',
  async () => {
    const res = await logoutAPI();
    return res.status === 200;
  }
);

/**
 * @description 获取用户信息
 */
export const actionGetUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async () => await ajaxGetUserInfo()
);

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginHandle.fulfilled, (state, { payload }) => {
      if (payload) {
        state.info = payload;
      }
    });
    builder.addCase(logoutHandle.fulfilled, (state, { payload }) => {
      state.info = undefined;
    });
    builder.addCase(actionGetUserInfo.fulfilled, (state, { payload }) => {
      const { status, data } = payload;
      if (status === 200 && data && Object.keys(data)) {
        state.info = data;
      }
    });
  }
});

export default userSlice.reducer;
