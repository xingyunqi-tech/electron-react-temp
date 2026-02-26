/**
 * 应用菜单服务
 *
 * macOS / Windows / Linux 差异化菜单:
 * - macOS: 应用名菜单 + 标准菜单 (About/隐藏/退出在应用菜单中)
 * - Windows/Linux: 文件 + 编辑 + 视图 + 帮助
 * - 开发环境: 额外的 DevTools 菜单项
 */

import { app, Menu, shell, type MenuItemConstructorOptions } from 'electron';

export class MenuService {
  static setup() {
    const template = this.buildTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private static buildTemplate(): MenuItemConstructorOptions[] {
    const isMac = process.platform === 'darwin';
    const template: MenuItemConstructorOptions[] = [];

    // macOS 应用菜单
    if (isMac) {
      template.push({
        label: app.getName(),
        submenu: [
          { role: 'about', label: '关于' },
          { type: 'separator' },
          { role: 'services', label: '服务' },
          { type: 'separator' },
          { role: 'hide', label: '隐藏' },
          { role: 'hideOthers', label: '隐藏其他' },
          { role: 'unhide', label: '显示全部' },
          { type: 'separator' },
          { role: 'quit', label: '退出' },
        ],
      });
    }

    // 文件菜单
    template.push({
      label: '文件',
      submenu: [isMac ? { role: 'close' as const, label: '关闭窗口' } : { role: 'quit' as const, label: '退出' }],
    });

    // 编辑菜单
    template.push({
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    });

    // 视图菜单
    template.push({
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '切换开发人员工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    });

    // 窗口菜单
    template.push({
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        ...(isMac
          ? [
              { type: 'separator' as const },
              { role: 'front' as const, label: '全部置于顶层' },
              { type: 'separator' as const },
              { role: 'window' as const, label: '窗口' },
            ]
          : [{ role: 'close' as const, label: '关闭' }]),
      ],
    });

    // 帮助菜单
    template.push({
      label: '帮助',
      submenu: [
        {
          label: '了解更多',
          click: () => shell.openExternal('https://electronjs.org'),
        },
      ],
    });

    return template;
  }
}
