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
        
        this.map = new MapGenerator(mapWidth, mapHeight, tileSize).generate();
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
        return;
        
        const playerPos = this.player.getComponent('Transform').position;
        
        // 在玩家视野外生成敌人
        let spawnX, spawnY;
        const angle = Math.random() * Math.PI * 2;
        
        spawnX = playerPos.x + Math.cos(angle) * this.enemySpawnDistance;
        spawnY = playerPos.y + Math.sin(angle) * this.enemySpawnDistance;
        
        // 确保敌人在地图范围内
        const mapWidth = this.map.width * this.map.tileSize;
        const mapHeight = this.map.height * this.map.tileSize;
        
        spawnX = Math.max(0, Math.min(mapWidth - 32, spawnX));
        spawnY = Math.max(0, Math.min(mapHeight - 32, spawnY));
        
        const enemy = new Enemy()
            .addComponent(new Transform({ x: spawnX, y: spawnY }))
            .addComponent(new RendererComponent({ color: '#FF0000', width: 32, height: 32 }))
            .addComponent(new AI(this.player))
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
        // 随机生成敌人
        if (Math.random() < 0.01) {
            this.spawnEnemy();
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