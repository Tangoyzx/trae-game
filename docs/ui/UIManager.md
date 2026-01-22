# UIManager API文档

## 1. 概述

UIManager是游戏UI系统的核心管理器，负责UI元素的生命周期管理、更新和渲染。它提供了一套完整的UI元素管理机制，支持z-index层级管理和事件处理。

## 2. 类定义

```javascript
class UIManager {
    constructor(game) { /* ... */ }
    // ...
}
```

## 3. 构造函数

```javascript
new UIManager(game)
```

**参数：**
- `game` - Game实例，游戏的主控制器

## 4. 核心方法

### 4.1 addElement(element)

添加UI元素到管理器中。

**参数：**
- `element` - UI元素实例，必须继承自UIPanel

**返回值：**
- 无

### 4.2 removeElement(element)

从管理器中移除UI元素。

**参数：**
- `element` - 要移除的UI元素实例

**返回值：**
- 无

### 4.3 getElementById(id)

根据ID获取UI元素。

**参数：**
- `id` - UI元素的唯一标识符

**返回值：**
- UI元素实例或null

### 4.4 update(deltaTime)

更新所有UI元素。

**参数：**
- `deltaTime` - 帧间隔时间（秒）

**返回值：**
- 无

### 4.5 render(ctx)

渲染所有UI元素。

**参数：**
- `ctx` - Canvas 2D上下文

**返回值：**
- 无

### 4.6 sortElementsByZIndex()

按z-index排序UI元素。

**参数：**
- 无

**返回值：**
- 无

## 5. 事件处理

UIManager负责处理UI元素的鼠标事件，包括：
- 鼠标悬停检测
- 鼠标点击检测
- 事件状态更新

## 6. 层级管理

UIManager支持UI元素的z-index层级管理：
- 每个UI元素都有一个zIndex属性
- 元素按zIndex从低到高排序
- 渲染时按顺序渲染，高zIndex元素显示在上方
- 鼠标事件从高zIndex元素开始检测

## 7. 使用示例

```javascript
// 创建UI管理器
const uiManager = new UIManager(game);

// 创建UI元素
const inventory = new Inventory({
    game: game,
    player: player
});

// 添加UI元素到管理器
uiManager.addElement(inventory);

// 在游戏循环中更新和渲染UI
function gameLoop(deltaTime) {
    // 更新UI
    uiManager.update(deltaTime);
    
    // 渲染UI
    uiManager.render(ctx);
}
```