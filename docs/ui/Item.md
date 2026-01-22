# Item API文档

## 1. 概述

Item系统是游戏物品的核心实现，负责物品的创建、使用和效果处理。它提供了一套完整的物品管理机制，支持多种物品类型和效果。

## 2. 类定义

### 2.1 Item类

```javascript
class Item {
    constructor(config, quantity = 1) { /* ... */ }
    // ...
}
```

### 2.2 ItemFactory类

```javascript
class ItemFactory {
    constructor() { /* ... */ }
    // ...
}
```

## 3. Item构造函数

```javascript
new Item(config, quantity)
```

**参数：**
- `config` - 物品配置对象，包含物品的基本信息和效果
- `quantity` - 物品数量，默认为1

## 4. 物品配置结构

```javascript
const itemConfig = {
    id: 1,                    // 物品ID
    name: "生命药水",           // 物品名称
    type: "consumable",       // 物品类型
    rarity: "common",         // 物品稀有度
    description: "恢复50点生命值", // 物品描述
    effect: {                 // 物品效果
        type: "heal",         // 效果类型
        value: 50             // 效果值
    },
    icon: "#FF0000",          // 物品图标（颜色或图片路径）
    stackable: true,          // 是否可堆叠
    maxStack: 99              // 最大堆叠数量
};
```

## 5. 物品类型

| 类型 | 描述 | 示例 |
|------|------|------|
| consumable | 消耗品，使用后减少数量 | 生命药水、力量药水 |
| weapon | 武器，提供伤害加成 | 铁剑、弓箭 |
| armor | 防具，提供防御加成 | 皮甲、铁甲 |
| currency | 货币，用于交易 | 金币、钻石 |
| material | 材料，用于合成 | 木材、矿石 |

## 6. 物品效果类型

| 类型 | 描述 | 参数 |
|------|------|------|
| heal | 恢复生命值 | `value` - 恢复量或"full" |
| mana | 恢复魔法值 | `value` - 恢复量 |
| buff | 增益效果 | `attribute` - 属性名, `value` - 增加值, `duration` - 持续时间 |
| damage | 武器伤害 | `value` - 伤害值 |
| defense | 防具防御 | `value` - 防御值 |
| currency | 货币效果 | 无 |
| material | 材料效果 | 无 |

## 7. Item核心方法

### 7.1 use(user)

使用物品，触发物品效果。

**参数：**
- `user` - 使用物品的实体（通常是玩家）

**返回值：**
- 布尔值，true表示物品使用后还有剩余数量，false表示物品已用完

### 7.2 canStack(otherItem)

检查物品是否可以与其他物品堆叠。

**参数：**
- `otherItem` - 要堆叠的物品

**返回值：**
- 布尔值，true表示可以堆叠，false表示不能堆叠

### 7.3 addQuantity(amount)

增加物品数量。

**参数：**
- `amount` - 要增加的数量

**返回值：**
- 布尔值，true表示全部数量都添加成功，false表示部分添加成功（堆叠已满）

### 7.4 removeQuantity(amount)

减少物品数量。

**参数：**
- `amount` - 要减少的数量

**返回值：**
- 布尔值，true表示物品已用完，false表示物品还有剩余

## 8. ItemFactory核心方法

### 8.1 createItem(itemId, quantity)

根据物品ID创建单个物品。

**参数：**
- `itemId` - 物品ID
- `quantity` - 物品数量，默认为1

**返回值：**
- Item实例或null

### 8.2 createItems(itemDataArray)

根据物品数据数组批量创建物品。

**参数：**
- `itemDataArray` - 物品数据数组，每个元素包含id和quantity

**返回值：**
- Item实例数组

### 8.3 createRandomItem()

创建随机物品。

**参数：**
- 无

**返回值：**
- Item实例

## 9. 使用示例

```javascript
// 使用物品工厂创建物品
const itemFactory = new ItemFactory();
const healthPotion = itemFactory.createItem(1, 5);

// 使用物品
const player = { /* ... */ };
const hasRemaining = healthPotion.use(player);

// 检查是否可以堆叠
const anotherPotion = itemFactory.createItem(1, 3);
if (healthPotion.canStack(anotherPotion)) {
    healthPotion.addQuantity(anotherPotion.quantity);
}

// 减少物品数量
const isEmpty = healthPotion.removeQuantity(2);
```

## 10. 物品效果实现

### 10.1 治疗效果
```javascript
useHeal(user) {
    if (user.health !== undefined) {
        if (this.effect.value === 'full') {
            user.health = user.maxHealth || 100;
        } else {
            user.health = Math.min(
                user.health + this.effect.value,
                user.maxHealth || 100
            );
        }
    }
}
```

### 10.2 增益效果
```javascript
useBuff(user) {
    if (!user.buffs) {
        user.buffs = [];
    }
    
    user.buffs.push({
        attribute: this.effect.attribute,
        value: this.effect.value,
        duration: this.effect.duration,
        remainingTime: this.effect.duration
    });
}
```