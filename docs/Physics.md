# Physics 模块 API 文档

## 简介
Physics模块负责处理游戏中的物理系统，包括重力、碰撞检测和物理状态更新。

## 类定义

### Physics

#### 构造函数
```javascript
constructor(game)
```
- **参数**：
  - `game`：Game实例，游戏主对象
- **成员变量**：
  - `gravity`：重力加速度，默认值为0.8
  - `tileSize`：瓦片大小，默认值为32

#### 方法

##### update(deltaTime)
- **功能**：更新所有实体的物理状态
- **参数**：
  - `deltaTime`：时间增量，单位毫秒
- **描述**：遍历所有实体，对每个带有启用的PhysicsBody组件的实体更新其物理状态

##### updatePhysicsBody(physicsBody, transform)
- **功能**：更新单个物理体的状态
- **参数**：
  - `physicsBody`：PhysicsBody组件实例
  - `transform`：Transform组件实例
- **描述**：应用重力、处理水平和垂直移动、检测碰撞并处理碰撞响应

##### checkTileCollision(x, y, width, height)
- **功能**：检查指定区域与地形的碰撞
- **参数**：
  - `x`：区域左上角x坐标
  - `y`：区域左上角y坐标
  - `width`：区域宽度
  - `height`：区域高度
- **返回值**：布尔值，表示是否发生碰撞
- **描述**：检查指定区域是否与地图中的固体瓦片碰撞

##### findClosestNonCollidingPosition(x, y, width, height)
- **功能**：寻找最近的无碰撞位置
- **参数**：
  - `x`：当前x坐标
  - `y`：当前y坐标
  - `width`：实体宽度
  - `height`：实体高度
- **返回值**：包含x和y属性的对象，表示最近的无碰撞位置
- **描述**：向四个方向搜索最近的无碰撞位置，用于处理实体卡在地形中的情况

## 使用示例

```javascript
// 在Game构造函数中初始化Physics
this.physics = new Physics(this);

// 在游戏主循环中更新物理
this.physics.update(deltaTime);
```

## 注意事项
- 物理系统依赖于实体的PhysicsBody和Transform组件
- 碰撞检测基于瓦片网格，精度为tileSize
- 当实体卡在地形中时，会自动被瞬移到最近的无碰撞位置