import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { Player } from './classes/Player.js';
import { Platform } from './classes/Platform.js';
import { Coin } from './classes/Coin.js';
import { Goal } from './classes/Goal.js';
import { Enemy } from './classes/Enemy.js';
import { KeyboardController } from './controls/KeyboardController.js';

// 游戏状态枚举
const GameState = {
    RUNNING: 'running',
    PAUSED: 'paused',
    DEAD: 'dead'
};

// 游戏类
export class Game {
    constructor() {
        // 获取Canvas和上下文
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        // 初始化游戏状态
        this.gameState = GameState.RUNNING;
        
        // 初始化键盘控制器
        this.keyboardController = new KeyboardController();
        
        // 游戏对象
        this.player = null;
        this.platforms = [];
        this.coins = [];
        this.goal = null;
        this.enemies = [];
        
        // 初始化游戏
        this.init();
    }

    // 初始化游戏
    init() {
        // 设置Canvas尺寸
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        // 初始化游戏对象
        this.initGameObjects();
        
        // 启动游戏主循环
        this.gameLoop();
    }

    // 初始化游戏对象
    initGameObjects() {
        // 重置游戏对象
        this.platforms = [];
        this.coins = [];
        
        // 创建玩家，固定在左下角地面上
        this.player = new Player(50, CANVAS_HEIGHT - 50 - 32); // 地面高度50，玩家高度32
        
        // 创建平台
        this.platforms.push(new Platform(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50)); // 地面
        this.platforms.push(new Platform(100, 500, 150, 20)); // 平台1
        this.platforms.push(new Platform(300, 420, 150, 20)); // 平台2 - 调整位置，降低高度差
        this.platforms.push(new Platform(450, 350, 150, 20)); // 平台3 - 调整位置，降低高度差
        this.platforms.push(new Platform(250, 280, 150, 20)); // 平台4 - 调整位置，降低高度差
        this.platforms.push(new Platform(550, 210, 150, 20)); // 平台5 - 调整位置，降低高度差
        
        // 创建金币，调整位置与新平台匹配
        this.coins.push(new Coin(150, 470));
        this.coins.push(new Coin(200, 470));
        this.coins.push(new Coin(350, 390));
        this.coins.push(new Coin(400, 390));
        this.coins.push(new Coin(500, 320));
        this.coins.push(new Coin(300, 250));
        this.coins.push(new Coin(600, 180));
        
        // 创建终点，调整位置使其更易到达
        this.goal = new Goal(650, 160);
        
        // 创建敌人，随机分配到平台上
        this.enemies = [];
        // 排除地面平台，只在其他平台上生成敌人
        const nonGroundPlatforms = this.platforms.slice(1);
        // 随机生成敌人，不是每个平台都生成
        for (let platform of nonGroundPlatforms) {
            // 50%的概率在平台上生成敌人
            if (Math.random() > 0.5) {
                // 平台的Transform组件包含位置信息
                const platformTransform = platform.getComponent('transform');
                if (!platformTransform) continue;
                
                // 在平台上随机位置生成敌人，确保敌人站在平台上
                const enemyX = platformTransform.x + Math.random() * (platformTransform.width - 30);
                const enemyY = platformTransform.y - 30; // 敌人高度30，正好站在平台上
                
                // 创建敌人
                const enemy = new Enemy(enemyX, enemyY);
                
                // 设置敌人初始状态，确保站在平台上
                const enemyTransform = enemy.getComponent('transform');
                const enemyPhysics = enemy.getComponent('physics');
                
                if (enemyTransform && enemyPhysics) {
                    // 确保敌人位置正确，直接站在平台上
                    enemyTransform.y = platformTransform.y - enemyTransform.height;
                    enemyPhysics.onGround = true;
                    enemyPhysics.velocityY = 0;
                }
                
                this.enemies.push(enemy);
            }
        }
    }

    // 设置游戏状态
    setGameState(state) {
        this.gameState = state;
    }

    // 重启游戏
    restartGame() {
        this.gameState = GameState.RUNNING;
        this.initGameObjects();
    }

    // 更新分数显示
    updateScore() {
        const playerControl = this.player.getComponent('playerControl');
        const score = playerControl ? playerControl.score : 0;
        this.scoreElement.textContent = `分数: ${score}`;
    }

    // 游戏主循环
    gameLoop() {
        // 清空画布
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // 根据游戏状态执行不同逻辑
        if (this.gameState === GameState.RUNNING) {
            // 更新时间
            const deltaTime = 16; // 假设60fps
            
            // 更新玩家
            const playerControl = this.player.getComponent('playerControl');
            if (playerControl) {
                const gameCompleted = playerControl.update(deltaTime, this.platforms, this.coins, this.goal, this.gameState, this.setGameState.bind(this));
                
                // 如果游戏完成，重新初始化游戏对象
                if (gameCompleted) {
                    this.initGameObjects();
                }
            }
            
            // 更新敌人
            this.enemies.forEach(enemy => enemy.update(deltaTime, this.platforms, this.player));
            
            // 更新金币旋转
            this.coins.forEach(coin => coin.update(deltaTime));
            
            // 检查玩家与敌人的碰撞
            for (let enemy of this.enemies) {
                if (this.player.getComponent('physics').checkCollision(enemy)) {
                    this.gameState = GameState.DEAD;
                }
            }
        }
        else if (this.gameState === GameState.DEAD) {
            // 绘制死亡提示
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('按 R 键重新开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
            
            // 检查是否按R键重启
            if (this.keyboardController.isRKeyPressed()) {
                this.restartGame();
            }
        }
        
        // 绘制所有游戏对象（无论游戏状态）
        this.platforms.forEach(platform => platform.draw(this.ctx));
        this.coins.forEach(coin => coin.draw(this.ctx));
        this.goal.draw(this.ctx);
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 更新分数显示
        this.updateScore();
        
        // 下一帧
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}