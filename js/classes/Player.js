import { GRAVITY, JUMP_FORCE, MOVE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

// 玩家类
export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.score = 0;
    }

    // 绘制玩家
    draw(ctx) {
        ctx.fillStyle = '#4169E1'; // 蓝色
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // 更新玩家状态
    update(platforms, coins, goal, gameState, setGameState) {
        // 应用重力
        this.velocityY += GRAVITY;
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;

        // 边界检查
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CANVAS_WIDTH) this.x = CANVAS_WIDTH - this.width;
        if (this.y > CANVAS_HEIGHT + 100) {
            // 掉出屏幕，玩家死亡
            setGameState('dead');
        }

        // 碰撞检测
        this.onGround = false;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                // 计算重叠区域
                const overlapX = Math.min(this.x + this.width, platform.x + platform.width) - Math.max(this.x, platform.x);
                const overlapY = Math.min(this.y + this.height, platform.y + platform.height) - Math.max(this.y, platform.y);
                
                // 确定碰撞方向
                if (overlapX < overlapY) {
                    // 左右碰撞
                    if (this.x < platform.x) {
                        this.x = platform.x - this.width;
                    } else {
                        this.x = platform.x + platform.width;
                    }
                    this.velocityX = 0;
                } else {
                    // 上下碰撞
                    if (this.velocityY > 0) {
                        // 从上方碰撞（落地）
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.onGround = true;
                    } else if (this.velocityY < 0) {
                        // 从下方碰撞（头顶到平台）
                        this.y = platform.y + platform.height;
                        this.velocityY = 0;
                    }
                }
            }
        }

        // 收集金币
        for (let i = coins.length - 1; i >= 0; i--) {
            if (this.checkCollision(coins[i])) {
                coins.splice(i, 1);
                this.score++;
            }
        }

        // 检查是否到达终点
        if (this.checkCollision(goal)) {
            alert(`恭喜！你完成了关卡！\n分数: ${this.score}`);
            this.reset();
            return true; // 表示游戏已完成，需要重新初始化
        }
        return false;
    }

    // 碰撞检测
    checkCollision(object) {
        return this.x < object.x + object.width &&
               this.x + this.width > object.x &&
               this.y < object.y + object.height &&
               this.y + this.height > object.y;
    }

    // 移动方法
    moveLeft() {
        this.velocityX = -MOVE_SPEED;
    }

    moveRight() {
        this.velocityX = MOVE_SPEED;
    }

    jump() {
        if (this.onGround) {
            this.velocityY = JUMP_FORCE;
            this.onGround = false;
        }
    }

    // 停止移动
    stop() {
        this.velocityX = 0;
    }

    // 重置玩家
    reset() {
        this.x = 50;
        this.y = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.score = 0;
    }
}