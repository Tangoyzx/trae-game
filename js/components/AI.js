class AI extends Component {
    constructor(target) {
        super();
        this.target = target;
        this.speed = 3;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        if (!this.target) return;
        
        const transform = this.entity.getComponent('Transform');
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (!transform || !physicsBody) return;
        
        const targetTransform = this.target.getComponent('Transform');
        if (!targetTransform) return;
        
        // 朝向目标移动
        const dx = targetTransform.position.x - transform.position.x;
        const dy = targetTransform.position.y - transform.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            physicsBody.velocity.x = (dx / distance) * this.speed;
            // 简化AI，只左右移动，不跳跃
        }
    }

    render(ctx) {
        // 不需要渲染
    }
}