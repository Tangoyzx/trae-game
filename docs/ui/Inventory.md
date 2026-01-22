# Inventory API文档

## 1. 概述

Inventory是游戏的物品栏系统，负责管理玩家的物品、物品栏的显示和交互。它提供了一套完整的物品管理机制，支持物品的添加、移除、使用和堆叠。

## 2. 类定义

### 2.1 Inventory类

```javascript
class Inventory extends UIPanel {
    constructor(options = {}) { /* ... */ }
    // ...
}
```

### 2.2 InventorySlot类

```javascript
class InventorySlot extends UIPanel {
    constructor(options = {}) { /* ... */ }
    // ...
}
```

## 3. Inventory构造函数

```javascript
new Inventory(options)
```

**参数：**
- `options.game` - Game实例，游戏的主控制器
- `options.player` - Player实例，物品栏所属的玩家
- `options.slotCount` - 物品栏格子数量，默认为10
- `options.slotSize` - 物品格子大小，默认为48
- `options.slotSpacing` - 物品格子间距，默认为8

## 4. Inventory核心方法

### 4.1 setVisible(visible)

设置物品栏的可见性。

**参数：**
- `visible` - 布尔值，true表示显示，false表示隐藏

**返回值：**
- 无

### 4.2 toggle()

切换物品栏的显示/隐藏状态。

**参数：**
- 无

**返回值：**
- 无

### 4.3 addItem(item)

添加物品到物品栏。

**参数：**
- `item` - Item实例，要添加的物品

**返回值：**
- 布尔值，true表示添加成功，false表示物品栏已满

### 4.4 removeItem(itemId, quantity)

从物品栏中移除物品。

**参数：**
- `itemId` - 物品ID
- `quantity` - 要移除的数量，默认为1

**返回值：**
- 布尔值，true表示移除成功，false表示物品不足

### 4.5 clear()

清空物品栏。

**参数：**
- 无

**返回值：**
- 无

### 4.6 getAllItems()

获取物品栏中的所有物品。

**参数：**
- 无

**返回值：**
- 物品数组

## 5. InventorySlot核心方法

### 5.1 setItem(item)

设置物品格子中的物品。

**参数：**
- `item` - Item实例，要设置的物品

**返回值：**
- 无

### 5.2 getItem()

获取物品格子中的物品。

**参数：**
- 无

**返回值：**
- Item实例或null

### 5.3 removeItem()

移除物品格子中的物品。

**参数：**
- 无

**返回值：**
- 被移除的Item实例

### 5.4 isEmpty()

检查物品格子是否为空。

**参数：**
- 无

**返回值：**
- 布尔值，true表示为空，false表示不为空

## 6. 物品使用流程

1. 玩家点击物品栏中的物品格子
2. InventorySlot触发onClick事件
3. Inventory处理点击事件，调用物品的use方法
4. Item根据配置执行相应的效果
5. 更新玩家状态或游戏世界
6. 如果物品是消耗品，使用后数量减少
7. 如果物品数量为0，从物品栏中移除

## 7. 事件处理

### 7.1 键盘事件
- 按I键可以打开/关闭物品栏

### 7.2 鼠标事件
- 鼠标悬停在物品格子上时，格子亮度增加
- 鼠标按下时，格子亮度降低
- 点击物品格子可以使用物品

## 8. 物品配置

物品栏系统支持多种物品类型，每种物品都有自己的配置：

```javascript
const ItemConfigs = {
    1: {
        id: 1,
        name: "生命药水",
        type: "consumable",
        effect: {
            type: "heal",
            value: 50
        },
        // ...
    },
    // ...
};
```

## 9. 使用示例

```javascript
// 创建物品栏
const inventory = new Inventory({
    game: game,
    player: player
});

// 添加物品到物品栏
const healthPotion = itemFactory.createItem(1, 5);
inventory.addItem(healthPotion);

// 将物品栏添加到UI管理器
game.uiManager.addElement(inventory);

// 打开物品栏
inventory.open();

// 关闭物品栏
inventory.close();

// 切换物品栏显示状态
inventory.toggle();
```