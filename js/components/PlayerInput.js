class PlayerInput extends Component {
    constructor(input) {
        super();
        this.input = input;
        this.spacePressed = false;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        const movement = this.entity.getComponent('Movement');
        if (!movement) return;
        
        const physicsBody = this.entity.getComponent('PhysicsBody');
        if (!physicsBody) return;
        
        // 左右移动
        if (this.input.isKeyPressed('a')) {
            movement.moveLeft();
        } else if (this.input.isKeyPressed('d')) {
            movement.moveRight();
        } else {
            movement.stopHorizontal();
        }
        
        // 跳跃 - 使用按键状态变化检测
        const isSpacePressed = this.input.isKeyPressed(' ');
        if (isSpacePressed && !this.spacePressed && physicsBody.onGround) {
            movement.jump();
        }
        this.spacePressed = isSpacePressed;
    }

    render(ctx) {
        // 不需要渲染
    }
}