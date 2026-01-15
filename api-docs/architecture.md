# 2D平台跳跃游戏 - 代码架构文档

## 1. 项目概述

这是一个基于HTML5 Canvas的2D平台跳跃游戏，玩家可以通过键盘控制角色在平台间跳跃，收集金币，躲避敌人，最终到达终点。游戏支持AI控制和键盘控制两种模式。

## 2. 代码架构

项目采用模块化设计，将不同功能的代码分离到不同的文件中，便于维护和扩展。整体架构如下：

```
├── index.html              # 游戏主页面，只包含简单的HTML结构和入口脚本
├── assets/                 # 游戏资源目录
│   ├── animations/         # 动画配置文件
│   ├── sprites/            # 精灵和序列帧贴图
│   └── textures/           # 静态纹理
├── js/                     # JavaScript代码目录
│   ├── main.js             # 游戏入口文件，初始化游戏
│   ├── game.js             # 游戏主逻辑，包含游戏循环和状态管理
│   ├── config.js           # 游戏配置常量
│   ├── classes/            # 游戏对象类
│   │   ├── Player.js       # 玩家类
│   │   ├── Platform.js     # 平台类
│   │   ├── Coin.js         # 金币类
│   │   ├── Goal.js         # 终点类
│   │   └── Enemy.js        # 敌人类
│   ├── components/         # 组件系统
│   │   ├── Entity.js       # 实体基类
│   │   ├── Transform.js    # 变换组件
│   │   ├── Physics.js      # 物理组件
│   │   ├── Render.js       # 渲染组件
│   │   ├── SpriteAnimator.js # 序列帧动画组件
│   │   ├── PlayerControl.js # 玩家控制组件
│   │   ├── AI.js           # AI组件
│   │   ├── Chase.js        # 追击AI组件
│   │   ├── Patrol.js       # 巡逻AI组件
│   │   ├── Rotation.js     # 旋转组件
│   │   ├── Coin.js         # 金币组件
│   │   ├── Goal.js         # 终点组件
│   │   └── Enemy.js        # 敌人组件
│   └── controls/           # 控制模块
│       ├── KeyboardController.js  # 键盘控制
│       └── AIController.js        # AI控制
└── api-docs/               # API文档目录
    ├── architecture.md     # 整体架构文档
    ├── config.md           # 配置模块文档
    ├── classes.md          # 游戏类文档
    ├── components.md       # 组件系统文档
    ├── controls.md         # 控制模块文档
    ├── game.md             # 游戏主逻辑文档
    └── rules.md            # 项目全局规则
```

## 3. 模块关系

### 3.1 依赖关系

```
main.js → game.js → {Player.js, Platform.js, Coin.js, Goal.js, Enemy.js, KeyboardController.js, AIController.js, config.js}
```

### 3.2 核心流程

1. **初始化流程**：
   - HTML加载完成后，执行`main.js`中的`initGame()`函数
   - `initGame()`创建`Game`实例，初始化游戏
   - `Game`构造函数加载Canvas，初始化游戏状态和控制器
   - 调用`init()`方法设置Canvas尺寸，初始化游戏对象
   - 启动游戏主循环`gameLoop()`

2. **游戏主循环**：
   - 清空画布
   - 根据游戏状态执行不同逻辑
   - 更新游戏对象状态
   - 检测碰撞和游戏事件
   - 绘制游戏对象
   - 请求下一帧动画

3. **控制流程**：
   - 键盘事件被`KeyboardController`捕获
   - 在游戏循环中，调用`keyboardController.controlPlayer()`方法控制玩家
   - AI控制模式下，调用`aiController.controlPlayer()`方法控制玩家

## 4. 扩展建议

1. **添加新的游戏对象**：在`classes/`目录下创建新的类文件，继承或实现相应的接口
2. **添加新的控制方式**：在`controls/`目录下创建新的控制器类
3. **修改游戏规则**：修改`config.js`中的常量或`game.js`中的游戏逻辑
4. **添加关卡系统**：扩展`game.js`，添加关卡数据和切换逻辑
5. **添加音效和特效**：创建新的模块处理音效和视觉特效

## 5. 技术栈

- HTML5 Canvas
- ES6+ JavaScript (模块化)
- CSS3