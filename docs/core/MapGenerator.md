# MapGenerator 模块 API 文档

## 简介
MapGenerator模块负责生成游戏地图，支持随机种子、地平线初始地图和多种后处理器，可生成多样化的地形，包括山峰、山谷和洞穴。

## 类定义

### MapGenerator

#### 构造函数
```javascript
constructor(width, height, tileSize, seed = Date.now())
```
- **参数**：
  - `width`：地图宽度，单位为瓦片数
  - `height`：地图高度，单位为瓦片数
  - `tileSize`：瓦片大小，单位为像素
  - `seed`：随机种子，用于复现地图，默认为当前时间
- **成员变量**：
  - `width`：地图宽度
  - `height`：地图高度
  - `tileSize`：瓦片大小
  - `seed`：随机种子
  - `map`：地图数据，二维数组，1表示地块，0表示空块
  - `playerSpawn`：玩家出生点坐标
  - `postProcessors`：后处理器数组
  - `currentSeed`：当前随机种子计数器

#### 方法

##### generate()
- **功能**：生成完整地图
- **描述**：初始化地图，生成基础地形，运行所有后处理器，确保底部有土地，生成玩家出生点
- **返回值**：MapGenerator实例，支持链式调用

##### generateBaseTerrain()
- **功能**：生成基础地形
- **描述**：创建地平线初始地图，地平线以下（y > height/2）都是地块，地平线以上都是空块

##### smoothTerrain()
- **功能**：平滑地形
- **描述**：根据相邻地块数量平滑地形，确保连片生成

##### countNeighbors(x, y)
- **功能**：计算指定位置的相邻地块数量
- **参数**：
  - `x`：x坐标
  - `y`：y坐标
- **返回值**：相邻地块数量

##### ensureBottomLand()
- **功能**：确保底部有土地
- **描述**：确保地图底部5行都是土地

##### generatePlayerSpawn()
- **功能**：生成玩家出生点
- **描述**：在地图中间偏上的位置寻找平坦的土地作为玩家出生点

##### seededRandom()
- **功能**：基于种子的随机数生成器
- **返回值**：0-1之间的随机数

##### getRandomInt(min, max)
- **功能**：生成指定范围内的随机整数
- **参数**：
  - `min`：最小值（包含）
  - `max`：最大值（包含）
- **返回值**：随机整数

##### getTile(x, y)
- **功能**：获取指定位置的瓦片类型
- **参数**：
  - `x`：x坐标
  - `y`：y坐标
- **返回值**：瓦片类型，1表示地块，0表示空块

##### isSolid(x, y)
- **功能**：检查指定位置是否为固体块
- **参数**：
  - `x`：x坐标
  - `y`：y坐标
- **返回值**：布尔值，true表示固体块

##### addPostProcessor(postProcessor)
- **功能**：添加后处理器
- **参数**：
  - `postProcessor`：后处理器实例
- **返回值**：MapGenerator实例，支持链式调用

##### runPostProcessors()
- **功能**：运行所有后处理器
- **描述**：按顺序运行所有后处理器，每个后处理器使用相同的随机种子

##### getPlayerSpawn()
- **功能**：获取玩家出生点
- **返回值**：玩家出生点坐标对象 {x, y}

### MountainValleyProcessor（山峰与山谷后处理器）

#### 构造函数
```javascript
constructor(options = {})
```
- **参数**：
  - `options`：配置选项
    - `mountainCount`：山峰数量，默认为3
    - `valleyCount`：山谷数量，默认为3
    - `mountainRadius`：山峰半径，默认为20
    - `valleyRadius`：山谷半径，默认为15
    - `smoothIterations`：平滑迭代次数，默认为2

#### 方法

##### process(mapGenerator)
- **功能**：处理地图，生成山峰和山谷
- **参数**：
  - `mapGenerator`：MapGenerator实例
- **描述**：随机生成山峰和山谷，抬高山峰的土块，挖空山谷的土块，然后平滑地形并添加随机起伏

### CaveProcessor（洞穴后处理器）

#### 构造函数
```javascript
constructor(options = {})
```
- **参数**：
  - `options`：配置选项
    - `caveCount`：洞穴数量，默认为5
    - `minCaveDistance`：洞穴最小间距，默认为5

#### 成员变量
- `caveConfigs`：洞穴类型配置
  - `small`：小型洞穴，大小范围10-30
  - `medium`：中型洞穴，大小范围31-80
  - `large`：大型洞穴，大小范围81-150

#### 方法

##### process(mapGenerator)
- **功能**：处理地图，生成洞穴
- **参数**：
  - `mapGenerator`：MapGenerator实例
- **描述**：随机生成多个洞穴，确保洞穴之间不连通且保持间距，使用从中心向周边随机扩散的算法

##### isValidCavePosition(mapGenerator, centerX, centerY, existingCaves)
- **功能**：检查洞穴位置是否合适
- **参数**：
  - `mapGenerator`：MapGenerator实例
  - `centerX`：洞穴中心x坐标
  - `centerY`：洞穴中心y坐标
  - `existingCaves`：现有洞穴数组
- **返回值**：布尔值，true表示位置合适

##### generateCave(mapGenerator, startX, startY, targetSize)
- **功能**：生成单个洞穴
- **参数**：
  - `mapGenerator`：MapGenerator实例
  - `startX`：起始x坐标
  - `startY`：起始y坐标
  - `targetSize`：洞穴目标大小
- **返回值**：洞穴对象，包含tiles属性（洞穴瓦片数组）

## 使用示例

### 基本使用
```javascript
// 创建地图生成器实例
const mapGenerator = new MapGenerator(100, 50, 32, 12345);

// 生成地图
const map = mapGenerator.generate();

// 获取玩家出生点
const spawnPos = map.getPlayerSpawn();
```

### 自定义后处理器
```javascript
// 创建地图生成器实例
const mapGenerator = new MapGenerator(100, 50, 32);

// 添加自定义配置的后处理器
mapGenerator
  .addPostProcessor(new MountainValleyProcessor({
    mountainCount: 5,
    valleyCount: 5,
    mountainRadius: 25,
    valleyRadius: 20
  }))
  .addPostProcessor(new CaveProcessor({
    caveCount: 8,
    minCaveDistance: 6
  }));

// 生成地图
const map = mapGenerator.generate();
```

## 工作流程

1. **初始化**：创建MapGenerator实例，设置地图尺寸、瓦片大小和随机种子
2. **生成基础地形**：创建地平线初始地图，地平线以下都是地块，以上都是空块
3. **运行后处理器**：
   - **山峰与山谷后处理器**：随机生成山峰和山谷，平滑地形，添加随机起伏
   - **洞穴后处理器**：随机生成多种大小的洞穴，确保洞穴之间不连通
4. **确保底部有土地**：确保地图底部5行都是土地，防止玩家掉落
5. **生成玩家出生点**：在地图中间偏上的位置寻找平坦的土地
6. **返回地图**：返回生成的地图实例

## 随机种子使用

地图生成系统使用基于种子的随机数生成器，确保相同种子生成相同的地图。每个后处理器在运行前都会重置随机种子计数器，确保不同后处理器之间的随机序列一致性。

```javascript
// 使用相同种子生成相同地图
const seed = 12345;
const map1 = new MapGenerator(100, 50, 32, seed).generate();
const map2 = new MapGenerator(100, 50, 32, seed).generate();
// map1 和 map2 生成的地图完全相同
```