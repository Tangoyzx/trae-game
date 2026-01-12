import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { Player } from './classes/Player.js';
import { Platform } from './classes/Platform.js';
import { Coin } from './classes/Coin.js';
import { Goal } from './classes/Goal.js';
import { Enemy } from './classes/Enemy.js';
import { KeyboardController } from './controls/KeyboardController.js';
import { AIController } from './controls/AIController.js';

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
        
        // 初始化控制器
        this.keyboardController = new KeyboardController();
        this.aiController = new AIController();
        
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
        
        // 创建玩家
        this.player = new Player(50, 50);
        
        // 创建平台
        this.platforms.push(new Platform(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50)); // 地面
        this.platforms.push(new Platform(100, 500, 150, 20)); // 平台1
        this.platforms.push(new Platform(300, 400, 150, 20)); // 平台2
        this.platforms.push(new Platform(500, 300, 150, 20)); // 平台3
        this.platforms.push(new Platform(200, 200, 150, 20)); // 平台4
        this.platforms.push(new Platform(600, 100, 150, 20)); // 平台5
        
        // 创建金币
        this.coins.push(new Coin(150, 470));
        this.coins.push(new Coin(200, 470));
        this.coins.push(new Coin(350, 370));
        this.coins.push(new Coin(400, 370));
        this.coins.push(new Coin(550, 270));
        this.coins.push(new Coin(250, 170));
        this.coins.push(new Coin(650, 70));
        
        // 创建终点
        this.goal = new Goal(700, 50);
        
        // 创建敌人，随机分配到平台上
        this.enemies = [];
        // 排除地面平台，只在其他平台上生成敌人
        const nonGroundPlatforms = this.platforms.slice(1);
        // 在每个非地面平台上随机生成0或1个敌人
        for (let platform of nonGroundPlatforms) {
            if (Math.random() > 0.5) {
                // 在平台上随机位置生成敌人
                const enemyX = platform.x + Math.random() * (platform.width - 30);
                const enemyY = platform.y - 30;
                this.enemies.push(new Enemy(enemyX, enemyY));
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
        this.scoreElement.textContent = `分数: ${this.player.score}`;
    }

    // 游戏主循环
    gameLoop() {
        // 清空画布
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // 根据游戏状态执行不同逻辑
        if (this.gameState === GameState.RUNNING) {
            // 键盘控制
            this.keyboardController.controlPlayer(this.player);
            
            // AI控制（仍然保留，方便切换）
            // this.aiController.controlPlayer(this.player, this.platforms, this.coins, this.goal);
            
            // 更新玩家
            const gameCompleted = this.player.update(this.platforms, this.coins, this.goal, this.gameState, this.setGameState.bind(this));
            
            // 如果游戏完成，重新初始化游戏对象
            if (gameCompleted) {
                this.initGameObjects();
            }
            
            // 更新敌人
            this.enemies.forEach(enemy => enemy.update(this.platforms, this.player));
            
            // 检查玩家与敌人的碰撞
            for (let enemy of this.enemies) {
                if (this.player.checkCollision(enemy)) {
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