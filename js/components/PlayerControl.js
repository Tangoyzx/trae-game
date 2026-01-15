// PlayerControl组件，处理玩家的键盘控制
import { MOVE_SPEED, JUMP_FORCE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

export class PlayerControl {
    constructor() {
        this.name = 'playerControl';
        this.entity = null;
        this.keys = {};
        this.score = 0;
        this.gameState = 'playing';
        this.setGameState = null;
        
        // 绑定事件监听器
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 阻止游戏控制键的默认浏览器行为
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyW', 'KeyA', 'KeyD'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    // 更新玩家控制
    update(deltaTime, platforms, coins, goal, gameState, setGameState) {
        this.gameState = gameState;
        this.setGameState = setGameState;
        
        const physics = this.entity.getComponent('physics');
        const transform = this.entity.getComponent('transform');

        if (!physics || !transform) return;

        // 处理移动
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            physics.velocityX = -MOVE_SPEED;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            physics.velocityX = MOVE_SPEED;
        } else {
            physics.velocityX = 0;
        }

        // 处理跳跃
        if ((this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW']) && physics.onGround) {
            physics.velocityY = JUMP_FORCE;
            physics.onGround = false;
        }

        // 应用重力
        physics.update(deltaTime);

        // 更新位置
        transform.x += physics.velocityX;
        transform.y += physics.velocityY;

        // 边界检查
        if (transform.x < 0) transform.x = 0;
        if (transform.x + transform.width > CANVAS_WIDTH) transform.x = CANVAS_WIDTH - transform.width;
        if (transform.y > CANVAS_HEIGHT + 100) {
            // 掉出屏幕，玩家死亡
            setGameState('dead');
        }

        // 平台碰撞检测
        this.handlePlatformCollisions(platforms, transform, physics);

        // 金币收集
        this.collectCoins(coins, physics);

        // 检查是否到达终点
        if (physics.checkCollision(goal)) {
            alert(`恭喜！你完成了关卡！\n分数: ${this.score}`);
            this.reset();
            return true; // 表示游戏已完成，需要重新初始化
        }
        return false;
    }

    // 处理平台碰撞
    handlePlatformCollisions(platforms, transform, physics) {
        physics.onGround = false;

        for (let platform of platforms) {
            if (physics.checkCollision(platform)) {
                const platformTransform = platform.getComponent('transform');
                if (!platformTransform) continue;

                // 计算重叠区域
                const overlapX = Math.min(transform.x + transform.width, platformTransform.x + platformTransform.width) - Math.max(transform.x, platformTransform.x);
                const overlapY = Math.min(transform.y + transform.height, platformTransform.y + platformTransform.height) - Math.max(transform.y, platformTransform.y);
                
                // 确定碰撞方向
                if (overlapX < overlapY) {
                    // 左右碰撞
                    if (transform.x < platformTransform.x) {
                        transform.x = platformTransform.x - transform.width;
                    } else {
                        transform.x = platformTransform.x + platformTransform.width;
                    }
                    physics.velocityX = 0;
                } else {
                    // 上下碰撞
                    if (physics.velocityY > 0) {
                        // 从上方碰撞（落地）
                        transform.y = platformTransform.y - transform.height;
                        physics.velocityY = 0;
                        physics.onGround = true;
                    } else if (physics.velocityY < 0) {
                        // 从下方碰撞（头顶到平台）
                        transform.y = platformTransform.y + platformTransform.height;
                        physics.velocityY = 0;
                    }
                }
            }
        }
    }

    // 收集金币
    collectCoins(coins, physics) {
        for (let i = coins.length - 1; i >= 0; i--) {
            if (physics.checkCollision(coins[i])) {
                coins.splice(i, 1);
                this.score++;
            }
        }
    }

    // 重置玩家
    reset() {
        const transform = this.entity.getComponent('transform');
        const physics = this.entity.getComponent('physics');
        
        if (transform && physics) {
            transform.x = 50;
            transform.y = 50;
            physics.velocityX = 0;
            physics.velocityY = 0;
            physics.onGround = false;
        }
        
        this.score = 0;
    }
}