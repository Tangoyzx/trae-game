// Physics组件，整合Velocity、Collision、Gravity的功能
import { GRAVITY } from '../config.js';

export class Physics {
    constructor(options = {}) {
        this.name = 'physics';
        this.entity = null;
        
        // Velocity属性
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        
        // Collision属性
        this.isColliding = false;
        this.collisionDirection = null;
        
        // Gravity属性
        this.gravity = options.gravity || GRAVITY;
        this.applyGravity = options.applyGravity !== false;
    }

    // 应用重力
    updateGravity(deltaTime) {
        if (this.applyGravity) {
            this.velocityY += this.gravity;
        }
    }

    // 检查与另一个实体的碰撞
    checkCollision(otherEntity) {
        const transform = this.entity.getComponent('transform');
        const otherTransform = otherEntity.getComponent('transform');

        if (!transform || !otherTransform) return false;

        return transform.x < otherTransform.x + otherTransform.width &&
               transform.x + transform.width > otherTransform.x &&
               transform.y < otherTransform.y + otherTransform.height &&
               transform.y + transform.height > otherTransform.y;
    }

    // 碰撞响应处理
    onCollision(otherEntity) {
        // 基础碰撞响应，可以被子类或其他组件覆盖
    }

    // 处理与平台的碰撞
    handlePlatformCollisions(platforms) {
        this.onGround = false;

        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                const transform = this.entity.getComponent('transform');
                const platformTransform = platform.getComponent('transform');
                if (!transform || !platformTransform) continue;

                // 计算重叠区域（穿透深度）
                const overlapX = Math.min(transform.x + transform.width, platformTransform.x + platformTransform.width) - Math.max(transform.x, platformTransform.x);
                const overlapY = Math.min(transform.y + transform.height, platformTransform.y + platformTransform.height) - Math.max(transform.y, platformTransform.y);
                
                // 正常物理碰撞思路：重叠小的方向即为碰撞方向
                if (overlapX < overlapY) {
                    // 左右碰撞：X方向重叠更小，沿着X轴分离
                    
                    // 计算碰撞方向：如果玩家中心在平台左侧，就是右侧碰撞，否则是左侧碰撞
                    const playerCenterX = transform.x + transform.width / 2;
                    const platformCenterX = platformTransform.x + platformTransform.width / 2;
                    
                    if (playerCenterX < platformCenterX) {
                        // 玩家在平台左侧，向右移动时碰撞到平台左侧边缘
                        // 向左分离：将玩家推到平台左侧
                        transform.x = platformTransform.x - transform.width;
                    } else {
                        // 玩家在平台右侧，向左移动时碰撞到平台右侧边缘
                        // 向右分离：将玩家推到平台右侧
                        transform.x = platformTransform.x + platformTransform.width;
                    }
                    
                    // 碰撞后停止水平速度
                    this.velocityX = 0;
                } else {
                    // 上下碰撞：Y方向重叠更小，沿着Y轴分离
                    
                    // 计算碰撞方向：如果玩家中心在平台上方，就是下方碰撞（落地），否则是上方碰撞（头顶）
                    const playerCenterY = transform.y + transform.height / 2;
                    const platformCenterY = platformTransform.y + platformTransform.height / 2;
                    
                    if (playerCenterY < platformCenterY) {
                        // 玩家在平台上方，向下移动时碰撞到平台顶部（落地）
                        // 向上分离：将玩家放置在平台顶部
                        transform.y = platformTransform.y - transform.height;
                        this.velocityY = 0;
                        this.onGround = true;
                    } else {
                        // 玩家在平台下方，向上移动时碰撞到平台底部（头顶）
                        // 向下分离：将玩家放置在平台底部下方
                        transform.y = platformTransform.y + platformTransform.height;
                        this.velocityY = 0;
                    }
                }
            }
        }
    }

    // 更新物理状态
    update(deltaTime, platforms = []) {
        // 应用重力
        this.updateGravity(deltaTime);
        
        // 应用速度更新位置
        const transform = this.entity.getComponent('transform');
        if (transform) {
            transform.x += this.velocityX;
            transform.y += this.velocityY;
        }
        
        // 处理平台碰撞
        this.handlePlatformCollisions(platforms);
    }
}