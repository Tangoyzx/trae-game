class PhysicsBody extends Component {
    constructor(options = {}) {
        super();
        this.size = { width: options.width || 32, height: options.height || 32 };
        this.velocity = { x: 0, y: 0 };
        this.onGround = false;
        this.enabled = true;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        // 更新逻辑
    }

    render(ctx) {
        // 不需要渲染
    }
}