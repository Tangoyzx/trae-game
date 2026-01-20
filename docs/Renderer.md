# Renderer 模块 API 文档

## 简介
Renderer模块负责游戏的渲染系统，包括清屏、渲染实体、渲染地图等功能。

## 类定义

### Renderer

#### 构造函数
```javascript
constructor(canvasId)
```
- **参数**：
  - `canvasId`：Canvas元素的ID
- **成员变量**：
  - `canvas`：Canvas元素
  - `ctx`：Canvas 2D上下文
  - `width`：Canvas宽度
  - `height`：Canvas高度
  - `camera`：相机实例，默认为null

#### 方法

##### setCamera(camera)
- **功能**：设置渲染器使用的相机
- **参数**：
  - `camera`：Camera实例

##### clear()
- **功能**：清空画布
- **描述**：使用clearRect方法清空整个画布

##### renderEntities(entities)
- **功能**：渲染所有实体
- **参数**：
  - `entities`：实体数组
- **描述**：遍历所有实体并调用其render方法

##### renderMap(map)
- **功能**：渲染地图
- **参数**：
  - `map`：Map实例
- **描述**：根据相机位置计算可见区域，渲染可见区域内的瓦片

##### getScreenPosition(worldPos)
- **功能**：将世界坐标转换为屏幕坐标
- **参数**：
  - `worldPos`：世界坐标对象，包含x和y属性
- **返回值**：屏幕坐标对象，包含x和y属性

##### getWorldPosition(screenPos)
- **功能**：将屏幕坐标转换为世界坐标
- **参数**：
  - `screenPos`：屏幕坐标对象，包含x和y属性
- **返回值**：世界坐标对象，包含x和y属性

## 使用示例

```javascript
// 创建渲染器
const renderer = new Renderer('gameCanvas');

// 设置相机
renderer.setCamera(camera);

// 清空画布
renderer.clear();

// 渲染地图
renderer.renderMap(map);

// 渲染实体
renderer.renderEntities(entities);

// 坐标转换
const screenPos = renderer.getScreenPosition({ x: 100, y: 100 });
const worldPos = renderer.getWorldPosition({ x: 200, y: 200 });
```