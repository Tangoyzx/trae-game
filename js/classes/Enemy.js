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
                alertRange: 80 
            }));
    }

    // 更新敌人状态
    update(deltaTime, platforms, player) {
        const transform = this.getComponent('transform');
        const physics = this.getComponent('physics');
        const patrol = this.getComponent('patrol');
        const chase = this.getComponent('chase');
        
        if (!transform || !physics || !patrol || !chase) return;

        // 检查是否在追逐状态
        chase.update(deltaTime, player);
        
        if (!chase.isChasing) {
            // 巡逻状态
            patrol.update(deltaTime);
        }

        // 调用Physics组件处理物理更新和碰撞
        physics.update(deltaTime, platforms);
        
        // 防止敌人跨平台追击
        this.handlePlatformBoundary(platforms, transform, physics, patrol);
    }

    // 处理平台边界，防止敌人跨平台追击
    handlePlatformBoundary(platforms, transform, physics, patrol) {
        // 找到当前敌人所在的平台
        let currentPlatform = null;
        for (let platform of platforms) {
            const platformTransform = platform.getComponent('transform');
            if (platformTransform && 
                transform.x >= platformTransform.x && 
                transform.x + transform.width <= platformTransform.x + platformTransform.width &&
                transform.y + transform.height >= platformTransform.y && 
                transform.y + transform.height <= platformTransform.y + platformTransform.height + 5) {
                currentPlatform = platform;
                break;
            }
        }
        
        // 设置当前平台到Patrol组件
        if (currentPlatform) {
            patrol.setCurrentPlatform(currentPlatform);
            
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