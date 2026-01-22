class UIButton extends UIPanel {
    constructor(options = {}) {
        super(options);
        
        this.text = options.text || 'Button';
        this.textColor = options.textColor || '#fff';
        this.fontSize = options.fontSize || 14;
        this.fontFamily = options.fontFamily || 'Arial, sans-serif';
        this.textAlign = options.textAlign || 'center';
        this.onClick = options.onClick || null;
        
        this.pressed = false;
    }

    onMouseDown() {
        super.onMouseDown();
        this.pressed = true;
    }

    onMouseUp() {
        super.onMouseUp();
        if (this.pressed && this.onClick) {
            this.onClick();
        }
        this.pressed = false;
    }

    onMouseLeave() {
        super.onMouseLeave();
        this.pressed = false;
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制背景（根据状态调整亮度）
        let bgColor = this.backgroundColor;
        if (this.uiManager) {
            if (this.status === 'hover') {
                bgColor = this.uiManager.adjustBrightness(bgColor, 30);
            } else if (this.status === 'active') {
                bgColor = this.uiManager.adjustBrightness(bgColor, -20);
            }
        }
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 绘制边框（根据状态调整亮度）
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

        // 绘制文本
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = 'middle';
        
        const textX = this.x + this.width / 2;
        const textY = this.y + this.height / 2;
        ctx.fillText(this.text, textX, textY);
    }
}