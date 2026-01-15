// AI组件，处理敌人的AI行为
export class AI {
    constructor() {
        this.name = 'ai';
        this.entity = null;
        this.state = 'patrolling'; // patrolling, chasing, idle
        this.target = null;
    }

    // 设置AI目标
    setTarget(target) {
        this.target = target;
    }

    // 更新AI状态
    update(deltaTime) {
        // 基础AI更新逻辑，可以被子类或其他AI组件覆盖
    }
}