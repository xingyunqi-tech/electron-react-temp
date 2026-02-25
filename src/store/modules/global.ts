import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { DEFAULT_LOCALE, DEFAULT_THEME_STYLE } from '@/constants/system';
import type { LocaleKey, ThemeStyleKey } from '@/interface/system';
import type { FrontendConfig } from '@/constants/frontendConfig';
import { createSelector } from 'reselect';

export const NAMESPACE = 'global' as const;

interface GlobalState {
  /** 当前语言 */
  currentLocale: LocaleKey;
  /** 当前主题 */
  currentTheme: ThemeStyleKey;
  /** 高级模式 */
  advanceMode: boolean;
  /** 前端配置 */
  frontendConfig: Partial<FrontendConfig>;
}

/**
 * 全局配置
 */
const initialState: GlobalState = {
  /** 语言 */
  currentLocale: DEFAULT_LOCALE as LocaleKey,
  /** 主题 */
  currentTheme: DEFAULT_THEME_STYLE as ThemeStyleKey,
  /** 高级模式 */
  advanceMode: false,
  /** 前端配置 */
  frontendConfig: {},
};

const globalSlice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    /** 设置语言 */
    setLocaleAction(state, action: PayloadAction<LocaleKey>) {
      state.currentLocale = action.payload;
    },
    /** 切换主题 */
    toggleThemeAction(state) {
      state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    },
    /** 设置主题 */
    setThemeAction(state, action: PayloadAction<ThemeStyleKey>) {
      state.currentTheme = action.payload;
    },
    /** 切换高级模式 */
    toggleAdvanceModeAction(state) {
      state.advanceMode = !state.advanceMode;
    },
    /** 设置前端配置 */
    setFrontendConfigAction(state, action: PayloadAction<Partial<FrontendConfig>>) {
      state.frontendConfig = action.payload;
    },
    /** 重置前端配置 */
    resetFrontendConfigAction(state) {
      state.frontendConfig = {};
    },
  },
});

// ==================== Actions ====================

export const {
  setLocaleAction,
  toggleThemeAction,
  setThemeAction,
  toggleAdvanceModeAction,
  setFrontendConfigAction,
  resetFrontendConfigAction,
} = globalSlice.actions;

// ==================== Thunks ====================

const ADVANCE_TAP_THRESHOLD = 5;
const ADVANCE_TAP_TIMEOUT = 3000;

let _tapCount = 0;
let _tapTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * 连续点击 Logo 5 次切换高级模式
 * @returns null=未触发, true=已开启, false=已关闭
 */
export function advanceModeTapAction(): ThunkAction<
  boolean | null,
  { [NAMESPACE]: GlobalState },
  unknown,
  UnknownAction
> {
  return (dispatch, getState) => {
    _tapCount += 1;
    clearTimeout(_tapTimer);

    if (_tapCount >= ADVANCE_TAP_THRESHOLD) {
      _tapCount = 0;
      dispatch(toggleAdvanceModeAction());
      return getState()[NAMESPACE].advanceMode;
    }

    _tapTimer = setTimeout(() => {
      _tapCount = 0;
    }, ADVANCE_TAP_TIMEOUT);
    return null;
  };
}

// ==================== Selectors ====================

/** global状态 */
export const globalRootSelector = (state: { [NAMESPACE]: GlobalState }) => state[NAMESPACE];

/** 当前语言 */
export const currentLocaleSelector = createSelector(globalRootSelector, state => {
  return state.currentLocale;
});
/** 当前主题 */
export const currentThemeSelector = createSelector(globalRootSelector, state => {
  return state.currentTheme;
});
/** 是否开启高级模式 */
export const advanceModeSelector = createSelector(globalRootSelector, state => {
  return state.advanceMode;
});
/** 前端配置 */
export const frontendConfigSelector = createSelector(globalRootSelector, state => {
  return state.frontendConfig;
});

// ==================== Reducer ====================

export default globalSlice.reducer;
