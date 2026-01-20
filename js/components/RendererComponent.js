class RendererComponent extends Component {
    constructor(options = {}) {
        super();
        this.color = options.color || '#FFFFFF';
        this.width = options.width || 32;
        this.height = options.height || 32;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        // 更新逻辑
    }

    render(ctx) {
        const transform = this.entity.getComponent('Transform');
        if (!transform) return;
        
        let screenPos = transform.position;
        
        // 尝试获取游戏实例和相机位置
        if (this.entity.game && this.entity.game.camera) {
            const cameraPos = this.entity.game.camera.position;
            const canvasWidth = this.entity.game.renderer.width;
            const canvasHeight = this.entity.game.renderer.height;
            screenPos = {
                x: transform.position.x - cameraPos.x + canvasWidth / 2,
                y: transform.position.y - cameraPos.y + canvasHeight / 2
            };
        }
        
        ctx.fillStyle = this.color;
        // 调整绘制位置，使角色的左上角对齐到transform.position
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
    }
}