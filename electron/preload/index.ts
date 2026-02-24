import { ipcRenderer, contextBridge } from 'electron';

// --------- IPC Channel Whitelist ---------
// 仅允许白名单内的 channel 通信，防止渲染进程任意调用主进程 API
// 新增 channel 时请在此处注册
const ALLOWED_SEND_CHANNELS: string[] = [];
const ALLOWED_INVOKE_CHANNELS: string[] = [];
const ALLOWED_ON_CHANNELS: string[] = [];

// --------- Expose safe API to the Renderer process ---------
// 保存包装后的 listener 引用，确保 on/off 使用同一函数引用
const listenerMap = new WeakMap<(...args: any[]) => void, (...args: any[]) => void>();

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (...args: any[]) => void) {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked ipcRenderer.on for channel: ${channel}`);
      return;
    }
    const wrapped = (_event: Electron.IpcRendererEvent, ...args: any[]) => listener(...args);
    listenerMap.set(listener, wrapped);
    ipcRenderer.on(channel, wrapped);
  },
  off(channel: string, listener: (...args: any[]) => void) {
    if (!ALLOWED_ON_CHANNELS.includes(channel)) return;
    const wrapped = listenerMap.get(listener);
    if (wrapped) {
      ipcRenderer.off(channel, wrapped);
      listenerMap.delete(listener);
    }
  },
  send(channel: string, ...args: unknown[]) {
    if (!ALLOWED_SEND_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked ipcRenderer.send for channel: ${channel}`);
      return;
    }
    ipcRenderer.send(channel, ...args);
  },
  invoke(channel: string, ...args: unknown[]) {
    if (!ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked ipcRenderer.invoke for channel: ${channel}`);
      return Promise.reject(new Error(`IPC channel "${channel}" is not allowed`));
    }
    return ipcRenderer.invoke(channel, ...args);
  },
});

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function createLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = createLoading();
domReady().then(appendLoading);

window.addEventListener('message', ev => {
  if (ev.source === window && ev.data?.payload === 'removeLoading') {
    removeLoading();
  }
});

setTimeout(removeLoading, 4999);
