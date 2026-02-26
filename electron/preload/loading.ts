/**
 * 应用启动 Loading 动画
 * 在 DOM 就绪后注入 CSS 动画，渲染进程加载完成后移除
 */

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise<boolean>(resolve => {
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

function createLoading() {
  const className = 'loaders-css__square-spin';
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
  background: #1677ff;
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
  background: #f5f5f5;
  z-index: 9;
}
@media (prefers-color-scheme: dark) {
  .${className} > div {
    background: #1668dc;
  }
  .app-loading-wrap {
    background: #141414;
  }
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
      document.head.appendChild(oStyle);
      document.body.appendChild(oDiv);
    },
    removeLoading() {
      oStyle.remove();
      oDiv.remove();
    },
  };
}

export function setupLoading() {
  const { appendLoading, removeLoading } = createLoading();
  domReady().then(appendLoading);

  window.addEventListener('message', ev => {
    if (ev.source === window && ev.data?.payload === 'removeLoading') {
      removeLoading();
    }
  });

  setTimeout(removeLoading, 4999);
}
