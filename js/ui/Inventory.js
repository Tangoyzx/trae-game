class Inventory extends UIPanel {
    constructor(options = {}) {
        super(options);
        
        this.game = options.game;
        this.player = options.player;
        this.slotCount = 10;
        this.slotSize = 48;
        this.slotSpacing = 8;
        
        this.inventorySlots = [];
        this.closeButton = null;
        
        // 设置默认位置（屏幕中央下方）
        this.setDefaultPosition();
        
        // 先初始化子元素（但不添加到UI管理器）
        this.initializeSlots();
        this.initializeCloseButton();
        
        // 初始状态为隐藏
        this.setVisible(false);
    }

    // 初始化物品格子
    initializeSlots() {
        // 清空现有格子
        this.inventorySlots.forEach(slot => {
            if (this.uiManager) {
                this.uiManager.removeElement(slot);
            }
        });
        this.inventorySlots = [];
        
        for (let i = 0; i < this.slotCount; i++) {
            const slot = new InventorySlot({
                x: this.x + i * (this.slotSize + this.slotSpacing) + 10,
                y: this.y + 30,
                width: this.slotSize,
                height: this.slotSize,
                slotIndex: i,
                onClick: this.onSlotClick.bind(this)
            });
            
            this.inventorySlots.push(slot);
            if (this.uiManager) {
                this.uiManager.addElement(slot);
            }
        }
    }

    // 初始化关闭按钮
    initializeCloseButton() {
        // 移除现有按钮
        if (this.closeButton && this.uiManager) {
            this.uiManager.removeElement(this.closeButton);
        }
        
        this.closeButton = new UIButton({
            x: this.x + this.width - 30,
            y: this.y + 5,
            width: 25,
            height: 25,
            text: 'X',
            fontSize: 16,
            backgroundColor: 'rgba(100, 0, 0, 0.5)',
            borderColor: '#660000',
            onClick: this.close.bind(this)
        });
        
        if (this.uiManager) {
            this.uiManager.addElement(this.closeButton);
        }
    }
    
    // 当UI管理器被设置时，重新初始化子元素
    setUIManager(uiManager) {
        this.uiManager = uiManager;
        this.initializeSlots();
        this.initializeCloseButton();
        
        // 确保子元素的可见性与父元素一致
        this.setVisible(this.visible);
    }

    // 设置默认位置
    setDefaultPosition() {
        // 计算物品栏宽度
        this.width = this.slotCount * (this.slotSize + this.slotSpacing) - this.slotSpacing + 20;
        this.height = this.slotSize + 50;
        
        // 屏幕中央下方
        const canvasWidth = this.game.renderer.width;
        const canvasHeight = this.game.renderer.height;
        
        this.x = (canvasWidth - this.width) / 2;
        this.y = canvasHeight - this.height - 20;
        
        this.updateRect();
        
        // 更新子元素位置
        this.updateChildPositions();
    }

    // 更新子元素位置
    updateChildPositions() {
        // 更新物品格子位置
        for (let i = 0; i < this.inventorySlots.length; i++) {
            const slot = this.inventorySlots[i];
            slot.setPosition(
                this.x + i * (this.slotSize + this.slotSpacing) + 10,
                this.y + 30
            );
        }
        
        // 更新关闭按钮位置
        if (this.closeButton) {
            this.closeButton.setPosition(
                this.x + this.width - 30,
                this.y + 5
            );
        }
    }

    // 设置物品栏可见性
    setVisible(visible) {
        this.visible = visible;
        
        // 更新所有子元素的可见性
        for (const slot of this.inventorySlots) {
            slot.setVisible(visible);
        }
        
        if (this.closeButton) {
            this.closeButton.setVisible(visible);
        }
    }

    // 切换物品栏显示/隐藏
    toggle() {
        this.setVisible(!this.visible);
    }

    // 打开物品栏
    open() {
        this.setVisible(true);
    }

    // 关闭物品栏
    close() {
        this.setVisible(false);
    }

    // 物品格子点击事件
    onSlotClick(slot) {
        const item = slot.getItem();
        if (item) {
            // 使用物品
            const keepItem = item.use(this.player);
            if (!keepItem) {
                // 物品使用后数量为0，移除物品
                slot.removeItem();
            }
        }
    }

    // 添加物品到物品栏
    addItem(item) {
        // 查找空格子或可堆叠的格子
        for (const slot of this.inventorySlots) {
            if (slot.isEmpty()) {
                slot.setItem(item);
                return true;
            } else if (slot.getItem().canStack(item)) {
                const existingItem = slot.getItem();
                const remainingSpace = existingItem.maxStack - existingItem.quantity;
                if (remainingSpace >= item.quantity) {
                    existingItem.addQuantity(item.quantity);
                    return true;
                } else {
                    existingItem.addQuantity(remainingSpace);
                    item.removeQuantity(remainingSpace);
                    // 继续寻找下一个格子
                }
            }
        }
        return false; // 物品栏已满
    }

    // 从物品栏移除物品
    removeItem(itemId, quantity = 1) {
        for (const slot of this.inventorySlots) {
            const item = slot.getItem();
            if (item && item.id === itemId) {
                if (item.quantity <= quantity) {
                    slot.removeItem();
                    quantity -= item.quantity;
                } else {
                    item.removeQuantity(quantity);
                    return true;
                }
            }
        }
        return quantity <= 0;
    }

    // 清空物品栏
    clear() {
        for (const slot of this.inventorySlots) {
            slot.removeItem();
        }
    }

    // 获取物品栏中的所有物品
    getAllItems() {
        return this.inventorySlots
            .map(slot => slot.getItem())
            .filter(item => item !== null);
    }

    // 更新物品栏（处理键盘事件）
    update(deltaTime) {
        super.update(deltaTime);
        
        // 检测键盘I键
        if (this.game.input.isKeyPressed('i')) {
            this.toggle();
            // 防止重复触发
            this.game.input.keys['i'] = false;
        }
    }

    render(ctx) {
        if (!this.visible) return;
        
        super.render(ctx);
        
        // 绘制标题
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('物品栏', this.x + this.width / 2, this.y + 20);
    }

    destroy() {
        // 销毁所有子元素
        for (const slot of this.inventorySlots) {
            slot.destroy();
        }
        if (this.closeButton) {
            this.closeButton.destroy();
        }
        
        super.destroy();
    }
}