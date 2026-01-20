class Transform extends Component {
    constructor(options = {}) {
        super();
        this.position = { x: options.x || 0, y: options.y || 0 };
        this.rotation = options.rotation || 0;
        this.scale = options.scale || { x: 1, y: 1 };
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        // 更新逻辑
    }
}