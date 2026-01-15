// Chase组件，处理敌人的追逐行为
export class Chase {
    constructor(options = {}) {
        this.name = 'chase';
        this.entity = null;
        this.chaseSpeed = options.chaseSpeed || 1.5; // 进一步降低追击速度，从2改为1.5
        this.alertRange = options.alertRange || 150;
        this.isChasing = false;
    }

    // 更新追逐行为
    update(deltaTime, player) {
        const transform = this.entity.getComponent('transform');
        const physics = this.entity.getComponent('physics');
        
        if (!transform || !physics || !player) return;

        // 获取玩家位置
        const playerTransform = player.getComponent('transform');
        if (!playerTransform) return;

        // 计算与玩家的距离
        const distanceToPlayer = Math.sqrt(
            Math.pow(playerTransform.x - transform.x, 2) + Math.pow(playerTransform.y - transform.y, 2)
        );

        // 检测玩家是否在警戒范围内
        if (distanceToPlayer <= this.alertRange) {
            this.isChasing = true;
            // 追逐玩家
            if (playerTransform.x < transform.x) {
                physics.velocityX = -this.chaseSpeed;
            } else {
                physics.velocityX = this.chaseSpeed;
            }
        } else {
            this.isChasing = false;
        }
    }
}