class InventorySlot extends UIPanel {
    constructor(options = {}) {
        super(options);
        
        this.slotIndex = options.slotIndex || 0;
        this.item = null;
        this.onClick = options.onClick || null;
        this.onHover = options.onHover || null;
        this.onLeave = options.onLeave || null;
        
        this.backgroundColor = '#222';
        this.borderColor = '#444';
    }

    // 设置物品
    setItem(item) {
        this.item = item;
    }

    // 获取物品
    getItem() {
        return this.item;
    }

    // 移除物品
    removeItem() {
        const item = this.item;
        this.item = null;
        return item;
    }

    // 检查格子是否为空
    isEmpty() {
        return this.item === null;
    }

    onMouseEnter() {
        super.onMouseEnter();
        if (this.onHover) {
            this.onHover(this);
        }
    }

    onMouseLeave() {
        super.onMouseLeave();
        if (this.onLeave) {
            this.onLeave(this);
        }
    }

    onMouseUp() {
        super.onMouseUp();
        if (this.onClick) {
            this.onClick(this);
        }
    }

    render(ctx) {
        if (!this.visible) return;

        // 绘制背景（根据状态调整亮度）
        let bgColor = this.backgroundColor;
        if (this.uiManager) {
            if (this.status === 'hover') {
                bgColor = this.uiManager.adjustBrightness(bgColor, 20);
            } else if (this.status === 'active') {
                bgColor = this.uiManager.adjustBrightness(bgColor, -15);
            }
        }
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 绘制边框（根据状态调整亮度）
        let borderColor = this.borderColor;
        if (this.uiManager) {
            if (this.status === 'hover') {
                borderColor = this.uiManager.adjustBrightness(borderColor, 40);
            } else if (this.status === 'active') {
                borderColor = this.uiManager.adjustBrightness(borderColor, -25);
            }
        }
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // 绘制物品
        if (this.item) {
            const iconSize = Math.min(this.width, this.height) - 4;
            const iconX = this.x + (this.width - iconSize) / 2;
            const iconY = this.y + (this.height - iconSize) / 2;
            this.item.render(ctx, iconX, iconY, iconSize);
        }
    }
}