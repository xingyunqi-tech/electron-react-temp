import { Button, Card } from 'antd';
import React, { Component } from 'react';

/**
 * [Bug #1] `export default class` 组件 —— 触发 HOC 注入丢失 `default` 关键字
 *
 * 期望 inject 后产出：
 *   class DefaultClassComponentWithOutIntl extends Component {...}
 *   export default withTranslation()(DefaultClassComponentWithOutIntl);
 *
 * 当前 Bug（ReactComponentInjector.ts:251-261）：
 *   只删除 `export ` 修饰符，遗留 `default` 关键字 →
 *   产出 `default class DefaultClassComponentWithOutIntl {...}`
 *   （孤立 default，语法错误，整文件无法编译；restore 也无法往返）
 *
 * 复现：对本文件跑 generate，diff 输出即可看到坏代码。
 */
export default class DefaultClassComponent extends Component {
  render() {
    return (
      <Card title="默认导出类组件">
        <h2>默认导出的类组件标题</h2>
        <p>这是一个通过 export default class 导出的类组件</p>
        <Button>默认导出按钮</Button>
      </Card>
    );
  }
}
