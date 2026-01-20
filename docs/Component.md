# Component 模块 API 文档

## 简介
Component模块是所有组件的基类，提供了基本的组件生命周期方法。

## 类定义

### Component

#### 构造函数
```javascript
constructor()
```
- **成员变量**：
  - `entity`：组件所属的实体，默认为null

#### 方法

##### setEntity(entity)
- **功能**：设置组件所属的实体
- **参数**：
  - `entity`：Entity实例

##### initialize()
- **功能**：初始化组件
- **描述**：组件初始化时调用的方法，子类可以重写此方法

##### update(deltaTime)
- **功能**：更新组件
- **参数**：
  - `deltaTime`：时间增量，单位秒
- **描述**：组件更新时调用的方法，子类可以重写此方法

##### render(ctx)
- **功能**：渲染组件
- **参数**：
  - `ctx`：Canvas 2D上下文
- **描述**：组件渲染时调用的方法，子类可以重写此方法

##### destroy()
- **功能**：销毁组件
- **描述**：组件销毁时调用的方法，子类可以重写此方法

## 使用示例

```javascript
// 创建自定义组件
class MyComponent extends Component {
    initialize() {
        console.log('MyComponent initialized');
    }
    
    update(deltaTime) {
        console.log('MyComponent updated:', deltaTime);
    }
    
    render(ctx) {
        console.log('MyComponent rendered');
    }
    
    destroy() {
        console.log('MyComponent destroyed');
    }
}

// 添加到实体
entity.addComponent(new MyComponent());
```