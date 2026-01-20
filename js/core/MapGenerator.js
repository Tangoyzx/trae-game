class MapGenerator {
    constructor(width, height, tileSize, seed = Date.now()) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.seed = seed;
        this.map = [];
        this.playerSpawn = { x: 0, y: 0 };
        this.postProcessors = [];
        this.currentSeed = seed;
    }
    
    // 基于种子的随机数生成器
    seededRandom() {
        const x = Math.sin(this.currentSeed++) * 10000;
        return x - Math.floor(x);
    }
    
    // 生成指定范围内的随机整数
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.seededRandom() * (max - min + 1)) + min;
    }

    generate() {
        // 初始化地图
        this.map = new Array(this.width).fill().map(() => new Array(this.height).fill(0));
        
        // 重置种子
        this.currentSeed = this.seed;
        
        // 生成基础地形（地平线初始地图）
        this.generateBaseTerrain();
        
        // 添加默认后处理器（如果没有手动添加）
        if (this.postProcessors.length === 0) {
            this.addPostProcessor(new MountainValleyProcessor());
            this.addPostProcessor(new CaveProcessor());
        }
        
        // 运行所有后处理器
        this.runPostProcessors();
        
        // 确保底部有土地
        this.ensureBottomLand();
        
        // 生成玩家出生点
        this.generatePlayerSpawn();
        
        return this;
    }

    generateBaseTerrain() {
        // 地平线初始地图：地平线以下都是地块，地平线以上都是空块
        const horizon = Math.floor(this.height / 2);
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.map[x][y] = y > horizon ? 1 : 0;
            }
        }
    }

    smoothTerrain() {
        // 平滑地形，确保连片生成
        const newMap = new Array(this.width).fill().map(() => new Array(this.height).fill(0));
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const neighborCount = this.countNeighbors(x, y);
                newMap[x][y] = neighborCount > 4 ? 1 : 0;
            }
        }
        
        this.map = newMap;
    }

    countNeighbors(x, y) {
        let count = 0;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const nx = x + i;
                const ny = y + j;
                
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    count += this.map[nx][ny];
                } else {
                    count += 1; // 边界外视为土地
                }
            }
        }
        
        return count;
    }

    ensureBottomLand() {
        // 确保底部几行都是土地
        const bottomRows = 5;
        
        for (let x = 0; x < this.width; x++) {
            for (let y = this.height - bottomRows; y < this.height; y++) {
                this.map[x][y] = 1;
            }
        }
    }

    generatePlayerSpawn() {
        // 在地图中间偏上的位置寻找平坦的土地
        const spawnX = Math.floor(this.width / 2);
        
        for (let y = this.height - 10; y >= 0; y--) {
            if (this.map[spawnX][y] === 1 && this.map[spawnX][y - 1] === 0) {
                this.playerSpawn.x = spawnX * this.tileSize;
                this.playerSpawn.y = (y - 1) * this.tileSize;
                break;
            }
        }
        
        // 如果没找到合适的位置，使用默认位置
        if (this.playerSpawn.x === 0 && this.playerSpawn.y === 0) {
            this.playerSpawn.x = Math.floor(this.width / 2) * this.tileSize;
            this.playerSpawn.y = (this.height - 6) * this.tileSize;
        }
    }

    simplexNoise(x, y) {
        // 简化的噪声函数
        return Math.sin(x * 4.0 + y * 6.0) * 0.25 + Math.sin(x * 10.0 + y * 10.0) * 0.25 + 0.5;
    }

    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.map[x][y];
        }
        return 0;
    }

    isSolid(x, y) {
        return this.getTile(x, y) === 1;
    }

    // 添加后处理器
    addPostProcessor(postProcessor) {
        this.postProcessors.push(postProcessor);
        return this;
    }
    
    // 运行所有后处理器
    runPostProcessors() {
        for (const processor of this.postProcessors) {
            // 重置种子，确保每个后处理器使用相同的随机序列
            this.currentSeed = this.seed;
            processor.process(this);
        }
    }
    
    getPlayerSpawn() {
        return this.playerSpawn;
    }
}

// 山峰与山谷后处理器
class MountainValleyProcessor {
    constructor(options = {}) {
        this.mountainCount = options.mountainCount || 3;
        this.valleyCount = options.valleyCount || 3;
        this.mountainRadius = options.mountainRadius || 20;
        this.valleyRadius = options.valleyRadius || 15;
        this.smoothIterations = options.smoothIterations || 2;
    }
    
    process(mapGenerator) {
        const { width, height, map } = mapGenerator;
        const horizon = Math.floor(height / 2);
        
        // 生成山峰
        for (let i = 0; i < this.mountainCount; i++) {
            const centerX = mapGenerator.getRandomInt(0, width - 1);
            const centerY = mapGenerator.getRandomInt(horizon, height - 10);
            this.createMountain(mapGenerator, centerX, centerY);
        }
        
        // 生成山谷
        for (let i = 0; i < this.valleyCount; i++) {
            const centerX = mapGenerator.getRandomInt(0, width - 1);
            const centerY = mapGenerator.getRandomInt(horizon + 5, height - 5);
            this.createValley(mapGenerator, centerX, centerY);
        }
        
        // 平滑处理
        for (let i = 0; i < this.smoothIterations; i++) {
            this.smoothTerrain(mapGenerator);
        }
        
        // 添加随机起伏
        this.addRandomRoughness(mapGenerator);
    }
    
    createMountain(mapGenerator, centerX, centerY) {
        const { width, height, map } = mapGenerator;
        const radius = this.mountainRadius;
        
        for (let x = Math.max(0, centerX - radius); x <= Math.min(width - 1, centerX + radius); x++) {
            for (let y = Math.max(0, centerY - radius); y <= Math.min(height - 1, centerY + radius); y++) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (distance <= radius) {
                    // 距离中心越近，抬升越高
                    const heightOffset = Math.floor((1 - distance / radius) * 10);
                    for (let offset = 0; offset <= heightOffset; offset++) {
                        if (y - offset >= 0) {
                            map[x][y - offset] = 1;
                        }
                    }
                }
            }
        }
    }
    
    createValley(mapGenerator, centerX, centerY) {
        const { width, height, map } = mapGenerator;
        const radius = this.valleyRadius;
        
        for (let x = Math.max(0, centerX - radius); x <= Math.min(width - 1, centerX + radius); x++) {
            for (let y = Math.max(0, centerY - radius); y <= Math.min(height - 1, centerY + radius); y++) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (distance <= radius) {
                    // 距离中心越近，挖空越深
                    const depth = Math.floor((1 - distance / radius) * 8);
                    for (let offset = 0; offset <= depth; offset++) {
                        if (y + offset < height) {
                            map[x][y + offset] = 0;
                        }
                    }
                }
            }
        }
    }
    
    smoothTerrain(mapGenerator) {
        const { width, height, map } = mapGenerator;
        const newMap = new Array(width).fill().map(() => new Array(height).fill(0));
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const neighborCount = this.countNeighbors(mapGenerator, x, y);
                // 调整平滑阈值，使地形更自然
                newMap[x][y] = neighborCount >= 4 ? 1 : 0;
            }
        }
        
        // 更新地图
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                map[x][y] = newMap[x][y];
            }
        }
    }
    
    countNeighbors(mapGenerator, x, y) {
        let count = 0;
        const { width, height, map } = mapGenerator;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const nx = x + i;
                const ny = y + j;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    count += map[nx][ny];
                } else {
                    count += 1; // 边界外视为土地
                }
            }
        }
        
        return count;
    }
    
    addRandomRoughness(mapGenerator) {
        const { width, height, map } = mapGenerator;
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 只对地表附近添加随机起伏
                if (map[x][y] === 1 && map[x][y - 1] === 0) {
                    // 30%的概率添加或移除一个块
                    if (mapGenerator.seededRandom() < 0.3) {
                        const change = mapGenerator.seededRandom() < 0.5 ? 1 : -1;
                        const newY = y + change;
                        if (newY >= 0 && newY < height) {
                            map[x][newY] = 1;
                            if (change > 0) {
                                map[x][y] = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

// 洞穴后处理器
class CaveProcessor {
    constructor(options = {}) {
        this.caveCount = options.caveCount || 5;
        this.caveConfigs = {
            small: { min: 10, max: 30 },
            medium: { min: 31, max: 80 },
            large: { min: 81, max: 150 }
        };
        this.minCaveDistance = options.minCaveDistance || 5;
    }
    
    process(mapGenerator) {
        const { width, height, map } = mapGenerator;
        const horizon = Math.floor(height / 2);
        const caves = [];
        
        // 生成多个洞穴
        for (let i = 0; i < this.caveCount; i++) {
            let cavePlaced = false;
            let attempts = 0;
            const maxAttempts = 50;
            
            while (!cavePlaced && attempts < maxAttempts) {
                attempts++;
                
                // 随机选择洞穴类型
                const caveTypes = Object.keys(this.caveConfigs);
                const caveType = caveTypes[mapGenerator.getRandomInt(0, caveTypes.length - 1)];
                
                // 确定洞穴大小
                const config = this.caveConfigs[caveType];
                const caveSize = mapGenerator.getRandomInt(config.min, config.max);
                
                // 随机选择洞穴中心位置（在地平线以下）
                const centerX = mapGenerator.getRandomInt(10, width - 10);
                const centerY = mapGenerator.getRandomInt(horizon + 5, height - 10);
                
                // 检查位置是否合适
                if (this.isValidCavePosition(mapGenerator, centerX, centerY, caves)) {
                    // 生成洞穴
                    const cave = this.generateCave(mapGenerator, centerX, centerY, caveSize);
                    if (cave) {
                        caves.push(cave);
                        cavePlaced = true;
                    }
                }
            }
        }
    }
    
    // 检查洞穴位置是否合适
    isValidCavePosition(mapGenerator, centerX, centerY, existingCaves) {
        // 检查是否与现有洞穴太近
        for (const cave of existingCaves) {
            for (const [cx, cy] of cave.tiles) {
                const distance = Math.sqrt(Math.pow(cx - centerX, 2) + Math.pow(cy - centerY, 2));
                if (distance < this.minCaveDistance) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // 生成单个洞穴
    generateCave(mapGenerator, startX, startY, targetSize) {
        const { width, height, map } = mapGenerator;
        const caveTiles = new Set();
        const queue = [];
        
        // 从起始位置开始
        if (startX >= 0 && startX < width && startY >= 0 && startY < height) {
            queue.push([startX, startY]);
            caveTiles.add(`${startX},${startY}`);
            map[startX][startY] = 0;
        }
        
        // 四个方向：上、右、下、左
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        
        // 扩散生成洞穴
        while (queue.length > 0 && caveTiles.size < targetSize) {
            // 随机选择一个位置继续扩散
            const randomIndex = mapGenerator.getRandomInt(0, queue.length - 1);
            const [x, y] = queue[randomIndex];
            queue.splice(randomIndex, 1);
            
            // 随机打乱方向顺序
            this.shuffleArray(directions, mapGenerator);
            
            // 向四个方向扩散
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                const key = `${nx},${ny}`;
                
                // 检查是否在地图范围内，是否是固体块，是否已经在洞穴中
                if (nx >= 1 && nx < width - 1 && ny >= 1 && ny < height - 1 && 
                    map[nx][ny] === 1 && !caveTiles.has(key)) {
                    
                    // 检查周围是否有足够的固体块支撑
                    if (this.hasEnoughSupport(map, nx, ny)) {
                        queue.push([nx, ny]);
                        caveTiles.add(key);
                        map[nx][ny] = 0;
                        
                        // 如果达到目标大小，停止生成
                        if (caveTiles.size >= targetSize) {
                            break;
                        }
                    }
                }
            }
        }
        
        // 转换为数组格式返回
        const cave = {
            tiles: Array.from(caveTiles).map(tile => tile.split(',').map(Number))
        };
        
        return cave;
    }
    
    // 检查周围是否有足够的固体块支撑
    hasEnoughSupport(map, x, y) {
        let solidCount = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                if (map[x + dx] && map[x + dx][y + dy] === 1) {
                    solidCount++;
                }
            }
        }
        // 需要至少4个固体块支撑
        return solidCount >= 4;
    }
    
    // 随机打乱数组（使用指定的随机数生成器）
    shuffleArray(array, mapGenerator) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = mapGenerator.getRandomInt(0, i);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}