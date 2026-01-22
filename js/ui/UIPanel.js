class UIPanel {
    constructor(options = {}) {
        this.id = options.id || Math.random().toString(36).substr(2, 9);
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 200;
        this.height = options.height || 150;
        this.visible = options.visible !== false;
        this.backgroundColor = options.backgroundColor || 'rgba(0, 0, 0, 0.7)';
        this.borderColor = options.borderColor || '#333';
        this.borderWidth = options.borderWidth || 2;
        this.zIndex = options.zIndex || 0; // 添加z-index属性
        
        this.uiManager = null;
        this.status = 'normal'; // normal, hover, active
        
        // 更新矩形区域
        this.updateRect();
    }

    updateRect() {
        this.rect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.updateRect();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.updateRect();
    }

    setVisible(visible) {
        this.visible = visible;
    }

    onMouseEnter() {
        if (this.status !== 'active') {
            this.status = 'hover';
        }
    }

    onMouseLeave() {
        this.status = 'normal';
    }

    onMouseDown() {
        this.status = 'active';
    }

    onMouseUp() {
        this.status = 'hover';
    }

    update(deltaTime) {
        // 子类可以重写此方法以实现自定义更新逻辑
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制背景
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 绘制边框（根据状态调整颜色亮度）
        let borderColor = this.borderColor;
        if (this.uiManager) {
            if (this.status === 'hover') {
                borderColor = this.uiManager.adjustBrightness(borderColor, 50);
            } else if (this.status === 'active') {
                borderColor = this.uiManager.adjustBrightness(borderColor, -30);
            }
        }
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    destroy() {
        // 子类可以重写此方法以实现自定义销毁逻辑
        if (this.uiManager) {
            this.uiManager.removeElement(this);
        }
    }
}