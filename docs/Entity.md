# Entity 模块 API 文档

## 简介
Entity模块是所有游戏实体的基类，提供了组件管理的功能。

## 类定义

### Entity

#### 构造函数
```javascript
constructor()
```
- **成员变量**：
  - `components`：组件对象，存储所有添加到实体的组件
  - `active`：实体是否激活，默认值为true

#### 方法

##### addComponent(component)
- **功能**：添加组件到实体
- **参数**：
  - `component`：组件实例
- **返回值**：实体自身，支持链式调用
- **描述**：将组件添加到实体，设置组件的实体引用，初始化组件，然后返回实体自身

##### getComponent(componentName)
- **功能**：获取实体的组件
- **参数**：
  - `componentName`：组件名称
- **返回值**：组件实例，如果不存在则返回undefined

##### removeComponent(componentName)
- **功能**：从实体移除组件
- **参数**：
  - `componentName`：组件名称
- **描述**：如果组件存在，先调用组件的destroy方法，然后从组件对象中删除

##### update(deltaTime)
- **功能**：更新实体的所有组件
- **参数**：
  - `deltaTime`：时间增量，单位秒
- **描述**：如果实体激活，则遍历所有组件并调用其update方法

##### render(ctx)
- **功能**：渲染实体的所有组件
- **参数**：
  - `ctx`：Canvas 2D上下文
- **描述**：如果实体激活，则遍历所有组件并调用其render方法

##### destroy()
- **功能**：销毁实体
- **描述**：设置实体为非激活状态，调用所有组件的destroy方法，清空组件对象

## 使用示例

```javascript
// 创建实体
const entity = new Entity();

// 添加组件
entity.addComponent(new Transform({ x: 100, y: 100 }))
      .addComponent(new RendererComponent({ color: '#FF0000', width: 32, height: 32 }));

// 获取组件
const transform = entity.getComponent('Transform');

// 更新实体
entity.update(deltaTime);

// 渲染实体
entity.render(ctx);

// 销毁实体
entity.destroy();
```