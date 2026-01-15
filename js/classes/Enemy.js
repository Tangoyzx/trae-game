import { Entity } from '../components/Entity.js';
import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Render } from '../components/Render.js';
import { AI } from '../components/AI.js';
import { Patrol } from '../components/Patrol.js';
import { Chase } from '../components/Chase.js';

// 敌人类，使用组件组合
export class Enemy extends Entity {
    constructor(x, y) {
        super();

        // 添加组件
        this.addComponent(new Transform({ x, y, width: 30, height: 30 }))
            .addComponent(new Physics())
            .addComponent(new Render({ color: '#FF4500' })) // 橙色
            .addComponent(new AI())
            .addComponent(new Patrol({ speed: 1 }))
            .addComponent(new Chase({ 
                chaseSpeed: 3, 
                alertRange: 150 
            }));
    }

    // 更新敌人状态
    update(deltaTime, platforms, player) {
        const transform = this.getComponent('transform');
        const physics = this.getComponent('physics');
        const patrol = this.getComponent('patrol');
        const chase = this.getComponent('chase');
        
        if (!transform || !physics || !patrol || !chase) return;

        // 首先处理平台碰撞，确保敌人在平台上
        this.handlePlatformCollisions(platforms, transform, physics, patrol);

        // 应用重力
        physics.update(deltaTime);

        // 检查是否在追逐状态
        chase.update(deltaTime, player);
        
        if (!chase.isChasing) {
            // 巡逻状态
            patrol.update(deltaTime);
        }

        // 更新位置
        transform.x += physics.velocityX;
        transform.y += physics.velocityY;

        // 再次处理平台碰撞，确保敌人不会离开平台
        this.handlePlatformCollisions(platforms, transform, physics, patrol);
    }

    // 处理平台碰撞
    handlePlatformCollisions(platforms, transform, physics, patrol) {
        physics.onGround = false;
        let currentPlatform = null;
        
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
                        patrol.direction = 1; // 改变巡逻方向
                    } else {
                        transform.x = platformTransform.x + platformTransform.width;
                        patrol.direction = -1; // 改变巡逻方向
                    }
                    physics.velocityX = 0;
                } else {
                    // 上下碰撞
                    if (physics.velocityY > 0) {
                        // 从上方碰撞（落地）
                        transform.y = platformTransform.y - transform.height;
                        physics.velocityY = 0;
                        physics.onGround = true;
                        currentPlatform = platform;
                    } else if (physics.velocityY < 0) {
                        // 从下方碰撞（头顶到平台）
                        transform.y = platformTransform.y + platformTransform.height;
                        physics.velocityY = 0;
                    }
                }
            }
        }

        // 设置当前平台到Patrol组件
        if (currentPlatform) {
            patrol.setCurrentPlatform(currentPlatform);
        }

        // 防止敌人跨平台追击
        if (physics.onGround && currentPlatform) {
            // 确保敌人不会离开当前平台太远
            const platformTransform = currentPlatform.getComponent('transform');
            if (!platformTransform) return;
            
            if (transform.x < platformTransform.x) {
                transform.x = platformTransform.x;
                patrol.direction = 1;
            } else if (transform.x + transform.width > platformTransform.x + platformTransform.width) {
                transform.x = platformTransform.x + platformTransform.width - transform.width;
                patrol.direction = -1;
            }
        }
    }
}