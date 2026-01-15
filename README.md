# AI编程学习 - 2D平台跳跃游戏

## 项目介绍
这是一个基于HTML5 Canvas的2D平台跳跃游戏，专为AI编程学习设计。玩家可以通过修改JavaScript代码中的`aiControl`函数来控制角色，实现自动游戏逻辑。

## 游戏目标
1. 收集黄色金币获得分数
2. 到达红色旗帜处完成关卡

## 项目结构
- `index.html` - 主页面，包含游戏画布和操作说明
- `js/` - JavaScript代码目录，包含游戏核心逻辑
- `assets/` - 资源文件目录
- `api-docs/` - API文档目录

## 启动方法
1. 确保已安装VS Code
2. 在VS Code中安装Live Server插件
3. 在VS Code中打开项目文件夹
4. 右键点击`index.html`文件，选择"Open with Live Server"
5. 游戏将在浏览器中自动打开

## AI编程接口
修改`js/ai.js`文件中的`aiControl`函数，使用以下方法控制角色：

### 控制方法
- `player.moveLeft()` - 向左移动
- `player.moveRight()` - 向右移动
- `player.jump()` - 跳跃

### 可用信息
- `player.x`, `player.y` - 玩家当前位置
- `platforms` - 所有平台的列表
- `coins` - 所有金币的列表
- `goal` - 终点位置

## 游戏说明
- 使用方向键或AI控制角色移动和跳跃
- 角色只能在平台上跳跃
- 收集所有金币可获得高分
- 到达终点即可完成关卡

## 技术栈
- HTML5 Canvas
- JavaScript (ES6+)
- 模块化设计

## 开发说明
该项目采用模块化设计，便于扩展和修改。主要模块包括：
- 游戏主循环
- 玩家控制系统
- 物理引擎
- 碰撞检测
- 渲染系统

## 许可证
MIT License