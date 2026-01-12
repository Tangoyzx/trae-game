# 控制模块文档

## 1. 概述

`controls/`目录包含游戏中使用的控制模块，包括键盘控制和AI控制。这些模块负责处理玩家输入和AI决策，控制游戏角色的行为。

## 2. 键盘控制器 (KeyboardController)

### 2.1 描述

`KeyboardController`类处理键盘输入，控制玩家角色的移动和跳跃。

### 2.2 构造函数

```javascript
new KeyboardController()
```

- **参数**：无
- **返回值**：KeyboardController实例

### 2.3 方法

#### `setupEventListeners()`
设置键盘事件监听器，捕获键盘按下和释放事件。
- **参数**：无
- **返回值**：无

#### `isRKeyPressed()`
检查R键是否被按下，用于重启游戏。
- **参数**：无
- **返回值**：布尔值，表示R键是否被按下

#### `controlPlayer(player)`
根据当前键盘状态控制玩家角色的移动。
- **参数**：`player` - 玩家对象
- **返回值**：无

### 2.4 键盘控制映射

| 按键 | 功能 |
|------|------|
| A / a | 向左移动 |
| D / d | 向右移动 |
| 空格键 | 跳跃 |
| R / r | 重启游戏（仅在死亡状态下有效） |

## 3. AI控制器 (AIController)

### 3.1 描述

`AIController`类提供AI控制功能，可以替代键盘输入控制玩家角色。

### 3.2 构造函数

```javascript
new AIController()
```

- **参数**：无
- **返回值**：AIController实例

### 3.3 方法

#### `controlPlayer(player, platforms, coins, goal)`
AI控制玩家角色的移动和跳跃。
- **参数**：
  - `player` - 玩家对象
  - `platforms` - 平台数组
  - `coins` - 金币数组
  - `goal` - 终点对象
- **返回值**：无

### 3.4 扩展建议

开发者可以修改`controlPlayer`方法，实现自定义的AI控制逻辑。例如：

```javascript
controlPlayer(player, platforms, coins, goal) {
    // 寻找最近的金币
    const nearestCoin = this.findNearestCoin(player, coins);
    
    // 向最近的金币移动
    if (nearestCoin) {
        if (nearestCoin.x < player.x) {
            player.moveLeft();
        } else {
            player.moveRight();
        }
        
        // 如果在金币下方，尝试跳跃
        if (Math.abs(nearestCoin.x - player.x) < 50 && player.onGround) {
            player.jump();
        }
    }
}
```

## 4. 控制模式切换

在`game.js`中，可以通过注释或取消注释以下代码来切换控制模式：

```javascript
// 键盘控制
this.keyboardController.controlPlayer(this.player);

// AI控制（仍然保留，方便切换）
// this.aiController.controlPlayer(this.player, this.platforms, this.coins, this.goal);
```

## 5. 扩展建议

- 添加游戏手柄支持
- 实现更多AI行为模式
- 添加本地存储，保存玩家按键配置