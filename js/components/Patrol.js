// Patrol组件，处理敌人的巡逻行为
export class Patrol {
    constructor(options = {}) {
        this.name = 'patrol';
        this.entity = null;
        this.speed = options.speed || 1;
        this.direction = options.direction || 1; // 1向右，-1向左
        this.currentPlatform = null;
    }

    // 设置当前平台
    setCurrentPlatform(platform) {
        this.currentPlatform = platform;
    }

    // 更新巡逻行为
    update(deltaTime) {
        const transform = this.entity.getComponent('transform');
        const physics = this.entity.getComponent('physics');
        
        if (!transform || !physics || !this.currentPlatform) return;

        // 获取平台的transform组件
        const platformTransform = this.currentPlatform.getComponent('transform');
        if (!platformTransform) return;

        // 设置巡逻速度
        physics.velocityX = this.speed * this.direction;

        // 检查是否到达平台边界
        if (transform.x <= platformTransform.x) {
            // 到达平台左边界，向右走
            transform.x = platformTransform.x;
            this.direction = 1;
        } else if (transform.x + transform.width >= platformTransform.x + platformTransform.width) {
            // 到达平台右边界，向左走
            transform.x = platformTransform.x + platformTransform.width - transform.width;
            this.direction = -1;
        }
    }
}