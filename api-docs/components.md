# 组件系统文档

## 1. 概述

组件系统是游戏的核心架构设计，采用组合模式，允许将不同功能模块化，通过组件的组合来构建复杂的游戏实体。每个实体（Entity）可以包含多个组件，每个组件负责特定的功能。

## 2. 核心概念

### 2.1 Entity（实体）

`Entity`是组件的容器，负责管理和协调各个组件。所有游戏对象（玩家、敌人、金币等）都是`Entity`的子类或实例。

### 2.2 Component（组件）

`Component`是具有特定功能的模块，可以附加到`Entity`上。组件之间通过`Entity`进行通信，共享实体的状态。

## 3. 组件分类

### 3.1 基础组件

| 组件名称 | 功能描述 |
|---------|---------|
| Entity | 实体基类，管理组件集合 |
| Transform | 处理位置、大小、旋转和缩放 |
| Render | 基础渲染组件，支持矩形、圆形和静态精灵 |
| Physics | 处理物理运动、碰撞检测和重力 |

### 3.2 渲染组件

| 组件名称 | 功能描述 |
|---------|---------|
| Render | 基础渲染组件 |
| SpriteAnimator | 序列帧动画组件，支持多状态动画 |
| Rotation | 处理旋转动画 |

### 3.3 控制组件

| 组件名称 | 功能描述 |
|---------|---------|
| PlayerControl | 玩家控制组件，处理输入和状态更新 |
| AI | 基础AI组件 |
| Chase | 追击AI组件，追踪目标 |
| Patrol | 巡逻AI组件，在指定区域巡逻 |

### 3.4 实体特定组件

| 组件名称 | 功能描述 |
|---------|---------|
| Coin | 金币组件，处理金币的收集逻辑 |
| Goal | 终点组件，处理游戏完成逻辑 |
| Enemy | 敌人组件，处理敌人的行为逻辑 |

## 4. 核心组件详解

### 4.1 Entity 类

#### 4.1.1 构造函数

```javascript
new Entity()
```

#### 4.1.2 方法

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `addComponent(component)` | `component` - 要添加的组件 | `this` | 添加组件到实体 |
| `getComponent(name)` | `name` - 组件名称 | 组件实例或`null` | 获取指定名称的组件 |
| `hasComponent(name)` | `name` - 组件名称 | 布尔值 | 检查是否包含指定组件 |
| `update(deltaTime, ...args)` | `deltaTime` - 时间差，`args` - 其他参数 | 无 | 更新所有组件 |
| `draw(ctx)` | `ctx` - Canvas 2D上下文 | 无 | 绘制所有组件 |

### 4.2 SpriteAnimator 类

#### 4.2.1 描述

`SpriteAnimator`是`Render`组件的子类，负责处理序列帧动画。支持多状态动画、帧率控制、循环播放和水平/垂直翻转。

#### 4.2.2 构造函数

```javascript
new SpriteAnimator(options)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| `options` | 对象 | 配置选项 |
| `options.type` | 字符串 | 组件类型，默认`'spriteAnimator'` |
| `options.texture` | Image对象 | 精灵表单纹理 |
| `options.frameWidth` | 数值 | 单帧宽度，默认32 |
| `options.frameHeight` | 数值 | 单帧高度，默认32 |
| `options.initialAnimation` | 字符串 | 初始动画名称 |
| `options.animations` | 对象 | 动画配置集合 |
| `options.playing` | 布尔值 | 是否自动播放，默认`true` |

#### 4.2.3 动画配置格式

```javascript
{
  "animationName": {
    "row": 0,              // 动画在精灵表单中的行号
    "frameCount": 8,       // 帧数
    "frameRate": 12,       // 帧率(fps)
    "loop": true,          // 是否循环
    "flipHorizontal": false // 是否水平翻转
  }
}
```

#### 4.2.4 方法

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `playAnimation(animationName, restart)` | `animationName` - 动画名称，`restart` - 是否重启，默认`true` | 无 | 播放指定动画 |
| `getCurrentAnimation()` | 无 | 字符串 | 获取当前动画名称 |
| `setAnimations(animations)` | `animations` - 动画配置集合 | 无 | 设置动画配置 |
| `setFlipHorizontal(flip)` | `flip` - 布尔值 | 无 | 设置水平翻转 |
| `setFlipVertical(flip)` | `flip` - 布尔值 | 无 | 设置垂直翻转 |
| `setTexture(texture)` | `texture` - Image对象 | 无 | 设置精灵表单纹理 |
| `play()` | 无 | 无 | 继续播放动画 |
| `pause()` | 无 | 无 | 暂停动画 |
| `stop()` | 无 | 无 | 停止并重置动画 |

### 4.3 Transform 类

#### 4.3.1 描述

`Transform`组件处理实体的位置、大小、旋转和缩放。

#### 4.3.2 构造函数

```javascript
new Transform(options)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| `options` | 对象 | 配置选项 |
| `options.x` | 数值 | X坐标，默认0 |
| `options.y` | 数值 | Y坐标，默认0 |
| `options.width` | 数值 | 宽度，默认32 |
| `options.height` | 数值 | 高度，默认32 |
| `options.angle` | 数值 | 旋转角度，默认0 |
| `options.scaleX` | 数值 | X轴缩放，默认1 |
| `options.scaleY` | 数值 | Y轴缩放，默认1 |

### 4.4 Physics 类

#### 4.4.1 描述

`Physics`组件处理实体的物理运动、碰撞检测和重力。

#### 4.4.2 构造函数

```javascript
new Physics(options)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| `options` | 对象 | 配置选项 |
| `options.velocityX` | 数值 | 初始水平速度，默认0 |
| `options.velocityY` | 数值 | 初始垂直速度，默认0 |
| `options.gravity` | 数值 | 重力加速度，默认0.5 |
| `options.onGround` | 布尔值 | 是否在地面上，默认`false` |

## 5. 组件使用示例

### 5.1 创建实体并添加组件

```javascript
const entity = new Entity();

entity.addComponent(new Transform({ x: 100, y: 100, width: 32, height: 32 }))
      .addComponent(new Physics())
      .addComponent(new SpriteAnimator({
          texture: playerSpriteSheet,
          frameWidth: 32,
          frameHeight: 32,
          initialAnimation: 'idle',
          animations: {
              idle: {
                  row: 0,
                  frameCount: 4,
                  frameRate: 8,
                  loop: true
              },
              walk: {
                  row: 1,
                  frameCount: 8,
                  frameRate: 12,
                  loop: true
              }
          }
      }));
```

### 5.2 更新和绘制实体

```javascript
// 更新实体（游戏循环中）
entity.update(deltaTime);

// 绘制实体（游戏循环中）
entity.draw(ctx);
```

### 5.3 切换动画

```javascript
const animator = entity.getComponent('spriteAnimator');
animator.playAnimation('walk');
```

## 6. 扩展建议

1. **添加组件生命周期**：为组件添加`init`、`destroy`等生命周期方法
2. **组件事件系统**：允许组件间通过事件进行通信
3. **组件序列化**：支持组件状态的保存和加载
4. **组件依赖检查**：自动检查组件间的依赖关系
5. **可视化编辑器**：创建可视化工具来编辑实体和组件

## 7. 最佳实践

1. **单一职责原则**：每个组件只负责一个特定功能
2. **低耦合**：组件间应通过实体进行通信，避免直接依赖
3. **高内聚**：相关功能应封装在同一个组件中
4. **可复用性**：设计通用组件，方便在不同实体间复用
5. **性能优化**：避免在组件的`update`或`draw`方法中进行复杂计算

## 8. 资源加载系统

### 8.1 ResourceLoader 类

#### 8.1.1 描述

`ResourceLoader`用于加载和管理游戏资源，包括图像和JSON配置文件。

#### 8.1.2 方法

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `loadImage(key, url)` | `key` - 资源键名，`url` - 资源URL | Promise | 加载单个图像资源 |
| `loadImages(imageList)` | `imageList` - 图像资源列表 | Promise | 批量加载图像资源 |
| `loadJSON(key, url)` | `key` - 资源键名，`url` - 资源URL | Promise | 加载JSON配置文件 |
| `getResource(key)` | `key` - 资源键名 | 资源对象 | 获取已加载的资源 |
| `hasResource(key)` | `key` - 资源键名 | 布尔值 | 检查资源是否已加载 |

### 8.2 AnimationConfigManager 类

#### 8.2.1 描述

`AnimationConfigManager`用于管理和加载动画配置，提供访问动画配置的接口。

#### 8.2.2 方法

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `loadAnimationConfig(key, url)` | `key` - 配置键名，`url` - 配置URL | Promise | 加载动画配置 |
| `getAnimationConfig(entityType)` | `entityType` - 实体类型 | 配置对象 | 获取指定实体类型的动画配置 |
| `getAnimation(entityType, animationState)` | `entityType` - 实体类型，`animationState` - 动画状态 | 动画配置 | 获取指定实体类型的特定动画配置 |
