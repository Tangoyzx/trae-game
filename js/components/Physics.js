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

    // 更新物理状态
    update(deltaTime) {
        // 应用重力
        this.updateGravity(deltaTime);
    }
}