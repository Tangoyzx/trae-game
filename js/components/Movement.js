class Movement extends Component {
    constructor(options = {}) {
        super();
        this.speed = options.speed || 5;
        this.jumpForce = options.jumpForce || 15;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        // 更新逻辑
    }

    moveLeft() {
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (physicsBody) {
            physicsBody.velocity.x = -this.speed;
        }
    }

    moveRight() {
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (physicsBody) {
            physicsBody.velocity.x = this.speed;
        }
    }

    stopHorizontal() {
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (physicsBody) {
            physicsBody.velocity.x = 0;
        }
    }

    jump() {
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (physicsBody) {
            physicsBody.velocity.y = -this.jumpForce;
            physicsBody.onGround = false;

        }
    }
}