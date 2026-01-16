# 创建README.md文件

## 项目介绍
- 这是一个基于HTML5 Canvas的2D平台跳跃游戏，用于AI编程学习
- 玩家可以通过修改JavaScript代码中的`aiControl`函数来控制角色
- 游戏目标是收集金币并到达终点

## 项目结构
- `index.html` - 主页面，包含游戏画布和说明
- `js/` - JavaScript代码目录，包含游戏核心逻辑
- `assets/` - 资源文件目录
- `api-docs/` - API文档目录

## 启动方法
1. 确保已安装VS Code
2. 在VS Code中安装Live Server插件
3. 在VS Code中打开项目文件夹
4. 右键点击`index.html`文件，选择"Open with Live Server"
5. 游戏将在浏览器中自动打开

## 游戏功能
- 玩家可以通过AI编程控制角色移动和跳跃
- 收集黄色金币获得分数
- 到达红色旗帜处完成关卡
- 提供了完整的AI编程接口

## AI编程接口
- `player.moveLeft()` - 向左移动
- `player.moveRight()` - 向右移动
- `player.jump()` - 跳跃
- 可用信息：`player.x`, `player.y`, `platforms`, `coins`, `goal`