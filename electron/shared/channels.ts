/**
 * IPC 通道常量定义 — 单一真实来源 (SSoT)
 * 被 main / preload 共同引用，确保通道名编译期一致
 */

export const IPC = {
  // ---- App ----
  APP_GET_INFO: 'app:get-info',
  APP_QUIT: 'app:quit',
  APP_RELAUNCH: 'app:relaunch',

  // ---- Window ----
  WIN_MINIMIZE: 'win:minimize',
  WIN_MAXIMIZE: 'win:maximize',
  WIN_UNMAXIMIZE: 'win:unmaximize',
  WIN_CLOSE: 'win:close',
  WIN_IS_MAXIMIZED: 'win:is-maximized',
  WIN_SET_TITLE: 'win:set-title',
  WIN_SET_SIZE: 'win:set-size',
  WIN_MAXIMIZED_CHANGED: 'win:maximized-changed',

  // ---- Dialog ----
  DIALOG_OPEN_FILE: 'dialog:open-file',
  DIALOG_SAVE_FILE: 'dialog:save-file',
  DIALOG_MESSAGE_BOX: 'dialog:message-box',

  // ---- Shell ----
  SHELL_OPEN_EXTERNAL: 'shell:open-external',
  SHELL_OPEN_PATH: 'shell:open-path',
  SHELL_SHOW_IN_FOLDER: 'shell:show-in-folder',

  // ---- Store (主进程 KV 持久化) ----
  STORE_GET: 'store:get',
  STORE_SET: 'store:set',
  STORE_DELETE: 'store:delete',

  // ---- Theme (主→渲染推送) ----
  THEME_GET: 'theme:get',
  THEME_CHANGED: 'theme:changed',

  // ---- Update ----
  UPDATE_CHECK: 'update:check',
  UPDATE_DOWNLOAD: 'update:download',
  UPDATE_INSTALL: 'update:install',
  UPDATE_STATUS: 'update:status',

  // ---- Clipboard ----
  CLIPBOARD_READ_TEXT: 'clipboard:read-text',
  CLIPBOARD_WRITE_TEXT: 'clipboard:write-text',

  // ---- Notification ----
  NOTIFICATION_SHOW: 'notification:show',

  // ---- Deep Link ----
  DEEP_LINK_GET_URL: 'deeplink:get-url',
  DEEP_LINK_RECEIVED: 'deeplink:received',
} as const;

export type IpcChannel = (typeof IPC)[keyof typeof IPC];
