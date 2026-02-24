import './app/index';

try {
  postMessage({ payload: 'removeLoading' }, '*');
} catch {
  // Electron file:// 下 postMessage 可能失败，preload 的 setTimeout 兜底移除 loading
}
