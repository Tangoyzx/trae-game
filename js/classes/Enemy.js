import { GRAVITY } from '../config.js';

// 敌人类
export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.patrolSpeed = 1; // 低速巡逻速度
        this.chaseSpeed = 3; // 追击速度
        this.alertRange = 150; // 警戒范围
        this.direction = 1; // 巡逻方向，1向右，-1向左
        this.isChasing = false; // 是否在追击玩家
    }

    // 绘制敌人
    draw(ctx) {
        ctx.fillStyle = '#FF4500'; // 橙色
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // 更新敌人状态
    update(platforms, player) {
        // 应用重力
        this.velocityY += GRAVITY;
        
        // 检测玩家是否在警戒范围内
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2)
        );
        
        if (distanceToPlayer <= this.alertRange) {
            this.isChasing = true;
        } else {
            this.isChasing = false;
        }

        // 移动逻辑
        if (this.isChasing) {
            // 加速追赶玩家
            if (player.x < this.x) {
                this.velocityX = -this.chaseSpeed;
            } else {
                this.velocityX = this.chaseSpeed;
            }
        } else {
            // 低速巡逻
            this.velocityX = this.patrolSpeed * this.direction;
        }

        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;

        // 碰撞检测和平台交互
        this.onGround = false;
        let currentPlatform = null;
        
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
                        this.direction = 1; // 改变巡逻方向
                    } else {
                        this.x = platform.x + platform.width;
                        this.direction = -1; // 改变巡逻方向
                    }
                    this.velocityX = 0;
                } else {
                    // 上下碰撞
                    if (this.velocityY > 0) {
                        // 从上方碰撞（落地）
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.onGround = true;
                        currentPlatform = platform;
                    } else if (this.velocityY < 0) {
                        // 从下方碰撞（头顶到平台）
                        this.y = platform.y + platform.height;
                        this.velocityY = 0;
                    }
                }
            }
        }

        // 防止敌人跨平台追击
        if (this.onGround && currentPlatform) {
            // 确保敌人不会离开当前平台太远
            if (this.x < currentPlatform.x) {
                this.x = currentPlatform.x;
                this.direction = 1;
            } else if (this.x + this.width > currentPlatform.x + currentPlatform.width) {
                this.x = currentPlatform.x + currentPlatform.width - this.width;
                this.direction = -1;
            }
        }
    }

    // 碰撞检测
    checkCollision(object) {
        return this.x < object.x + object.width &&
               this.x + this.width > object.x &&
               this.y < object.y + object.height &&
               this.y + this.height > object.y;
    }
}