import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithPhone, getCurrentUser } from '@/api';
import storage from '@/plugins/storage';
import { appStorage } from '@/store/framework';
import { createSelector } from 'reselect';
import { encryptPassword } from '@/utils';

export const NAMESPACE = 'user' as const;

/**
 * 统一的用户信息接口
 */
export interface UserState {
  id: number | undefined;
  username: string;
  realName: string;
  email: string;
  phone: string;
  role: string;
}

const initialState: UserState = {
  id: undefined,
  username: '',
  realName: '',
  email: '',
  phone: '',
  role: '',
};

// ==================== Async Thunks ====================

/** 发起登录 */
export const loginAction = createAsyncThunk('user/login', async (credentials: { phone: string; password: string }) => {
  const loginData = await loginWithPhone({
    phone: credentials.phone,
    password: encryptPassword(credentials.password),
  });

  if (!loginData?.token) {
    throw new Error('登录失败：未获取到token');
  }

  storage('localStorage').set('token', loginData.token);
  storage('localStorage').set('refreshToken', loginData.refreshToken);

  return loginData;
});

/** 获取用户信息 */
export const getInfoAction = createAsyncThunk('user/getInfo', async () => {
  const userData = await getCurrentUser();

  if (!userData) {
    throw new Error('获取用户信息失败');
  }

  return userData;
});

// ==================== Slice ====================

const userSlice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    /** 退出登录 */
    logoutAction(state) {
      storage('localStorage').remove('token');
      storage('localStorage').remove('refreshToken');
      Object.assign(state, initialState);
      appStorage.removeItem(NAMESPACE);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.id = user.id;
        state.username = user.nickname ?? '';
        state.realName = `${user.firstName ?? ''}${user.lastName ?? ''}`.trim();
        state.email = user.email ?? '';
        state.phone = user.phone ?? '';
        state.role = user.role?.name ?? '';
      })
      .addCase(getInfoAction.fulfilled, (state, action) => {
        const user = action.payload;
        state.id = user.id ?? state.id;
        state.username = user.nickname ?? state.username;
        state.realName = `${user.firstName ?? ''}${user.lastName ?? ''}`.trim() || state.realName;
        state.email = user.email ?? state.email;
        state.phone = user.phone ?? state.phone;
        state.role = user.role?.name ?? state.role;
      });
  },
});

// ==================== Actions ====================

export const { logoutAction } = userSlice.actions;

// ==================== Selectors ====================

/** user状态 */
export const userRootSelector = (state: { [NAMESPACE]: UserState }) => state[NAMESPACE];

/** 真实姓名 */
export const realNameSelector = createSelector(userRootSelector, state => {
  return state.realName;
});

/** 用户角色 */
export const userRoleSelector = createSelector(userRootSelector, state => {
  return state.role;
});

// ==================== Reducer ====================

export default userSlice.reducer;
