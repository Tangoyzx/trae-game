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
        
        // 跳跃状态标志，用于防止持续按住跳跃键连续跳跃
        this.wasJumping = false;
        
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

        // 处理跳跃 - 只有在按键按下瞬间才触发，而不是持续按住
        const isJumpingKeyPressed = this.keys['ArrowUp'] || this.keys['Space'] || this.keys['KeyW'];
        
        if (isJumpingKeyPressed && !this.wasJumping && physics.onGround) {
            physics.velocityY = JUMP_FORCE;
            physics.onGround = false;
        }
        
        // 更新跳跃状态标志
        this.wasJumping = isJumpingKeyPressed;

        // 调用Physics组件处理物理更新和碰撞
        physics.update(deltaTime, platforms);

        // 边界检查
        if (transform.x < 0) transform.x = 0;
        if (transform.x + transform.width > CANVAS_WIDTH) transform.x = CANVAS_WIDTH - transform.width;
        if (transform.y > CANVAS_HEIGHT + 100) {
            // 掉出屏幕，玩家死亡
            setGameState('dead');
        }

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