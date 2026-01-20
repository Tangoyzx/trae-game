class MapGenerator {
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.map = [];
        this.playerSpawn = { x: 0, y: 0 };
    }

    generate() {
        // 初始化地图
        this.map = new Array(this.width).fill().map(() => new Array(this.height).fill(0));
        
        // 生成基础地形
        this.generateBaseTerrain();
        
        // 平滑地形
        this.smoothTerrain();
        
        // 确保底部有土地
        this.ensureBottomLand();
        
        // 生成玩家出生点
        this.generatePlayerSpawn();
        
        return this;
    }

    generateBaseTerrain() {
        // 使用分形噪声生成基础地形
        const noiseScale = 0.05;
        const threshold = 0.3;
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // 简单的噪声生成
                const noise = this.simplexNoise(x * noiseScale, y * noiseScale);
                this.map[x][y] = noise > threshold ? 1 : 0;
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

    getPlayerSpawn() {
        return this.playerSpawn;
    }
}