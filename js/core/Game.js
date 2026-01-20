class Game {
    constructor() {
        this.entities = [];
        this.renderer = null;
        this.physics = null;
        this.input = null;
        this.camera = null;
        this.map = null;
        this.player = null;
        this.lastTime = 0;
        this.enemySpawnDistance = 500;
        this.maxEnemies = 10;
        this.lastEnemySpawnTime = 0;
        this.enemySpawnInterval = 5; // 5秒
    }

    initialize() {
        // 初始化渲染器
        this.renderer = new Renderer('gameCanvas');
        
        // 初始化输入系统
        this.input = new Input();
        
        // 初始化相机
        this.camera = new Camera(this);
        this.renderer.setCamera(this.camera);
        
        // 初始化物理系统
        this.physics = new Physics(this);
        
        // 生成地图
        this.generateMap();
        
        // 创建玩家
        this.createPlayer();
        
        // 设置相机目标
        this.camera.setTarget(this.player);
        
        // 开始游戏循环
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    generateMap() {
        const mapWidth = 100;
        const mapHeight = 50;
        const tileSize = 32;
        
        // 使用固定种子以便测试和复现
        const seed = 12345;
        this.map = new MapGenerator(mapWidth, mapHeight, tileSize, seed).generate();
        
        // 简单的地图验证
        console.log('地图生成完成，尺寸:', mapWidth, 'x', mapHeight);
        console.log('玩家出生点:', this.map.getPlayerSpawn());
    }

    createPlayer() {
        const spawnPos = this.map.getPlayerSpawn();
        
        this.player = new Player()
            .addComponent(new Transform({ x: spawnPos.x, y: spawnPos.y }))
            .addComponent(new RendererComponent({ color: '#00FFFF', width: 32, height: 64 }))
            .addComponent(new PlayerInput(this.input))
            .addComponent(new Movement({ speed: 5, jumpForce: 15 }))
            .addComponent(new PhysicsBody({ width: 32, height: 64 }));
        
        this.player.game = this;
        this.entities.push(this.player);
    }

    spawnEnemy() {
        if (this.entities.filter(e => e instanceof Enemy).length >= this.maxEnemies) {
            return;
        }
        
        const playerPos = this.player.getComponent('Transform').position;
        const tileSize = this.map.tileSize;
        const mapWidth = this.map.width * tileSize;
        const mapHeight = this.map.height * tileSize;
        
        // 计算视野范围
        const viewRadius = Math.max(this.renderer.width, this.renderer.height) / 2 + 100; // 视野半径，额外加100像素确保在视野外
        const viewLeft = playerPos.x - viewRadius;
        const viewRight = playerPos.x + viewRadius;
        const viewTop = playerPos.y - viewRadius;
        const viewBottom = playerPos.y + viewRadius;
        
        // 收集所有视野外的土块位置
        const validSpawnPositions = [];
        
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const tile = this.map.getTile(x, y);
                if (tile === 1) { // 1表示土地
                    const worldX = x * tileSize;
                    const worldY = y * tileSize;
                    
                    // 检查是否在视野外
                    if (worldX < viewLeft || worldX > viewRight || worldY < viewTop || worldY > viewBottom) {
                        validSpawnPositions.push({ x: worldX, y: worldY });
                    }
                }
            }
        }
        
        // 如果没有合适的位置，就不生成敌人
        if (validSpawnPositions.length === 0) {
            return;
        }
        
        // 随机选择一个位置
        const spawnPos = validSpawnPositions[Math.floor(Math.random() * validSpawnPositions.length)];
        
        const enemy = new Enemy()
            .addComponent(new Transform({ x: spawnPos.x, y: spawnPos.y }))
            .addComponent(new RendererComponent({ color: '#FF0000', width: 32, height: 32 }))
            .addComponent(new AI(this.player))
            .addComponent(new Movement({ speed: 3, jumpForce: 12 }))
            .addComponent(new PhysicsBody({ width: 32, height: 32 }));
        
        enemy.game = this;
        this.entities.push(enemy);
    }

    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染游戏
        this.render();
        
        // 继续游戏循环
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        // 定时生成敌人
        this.lastEnemySpawnTime += deltaTime;
        if (this.lastEnemySpawnTime >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawnTime = 0;
        }
        
        // 更新相机
        this.camera.update(deltaTime);
        
        // 更新实体（包括玩家输入）
        for (const entity of this.entities) {
            entity.update(deltaTime);
        }
        
        // 更新物理
        this.physics.update(deltaTime);
        
        // 清理死亡实体
        this.entities = this.entities.filter(entity => entity.active);
    }

    render() {
        // 清空画布
        this.renderer.clear();
        
        // 渲染地图
        this.renderer.renderMap(this.map);
        
        // 渲染实体
        this.renderer.renderEntities(this.entities);
    }
}