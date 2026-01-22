class UIManager {
    constructor(game) {
        this.game = game;
        this.uiElements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLeft = false;
        this.hoverElement = null;
        this.activeElement = null;
    }

    addElement(element) {
        // 设置默认z-index
        if (!element.zIndex) {
            element.zIndex = 0;
        }
        
        this.uiElements.push(element);
        element.uiManager = this;
        
        // 按z-index排序UI元素（从低到高）
        this.sortElementsByZIndex();
        
        // 调用元素的setUIManager方法（如果存在）
        if (element.setUIManager) {
            element.setUIManager(this);
        }
        
        if (element.initialize) {
            element.initialize();
        }
    }
    
    // 按z-index排序UI元素
    sortElementsByZIndex() {
        this.uiElements.sort((a, b) => a.zIndex - b.zIndex);
    }

    removeElement(element) {
        const index = this.uiElements.indexOf(element);
        if (index > -1) {
            this.uiElements.splice(index, 1);
            if (element === this.hoverElement) {
                this.hoverElement = null;
            }
            if (element === this.activeElement) {
                this.activeElement = null;
            }
        }
    }

    getElementById(id) {
        return this.uiElements.find(element => element.id === id);
    }

    update(deltaTime) {
        // 更新鼠标位置
        const mousePos = this.game.input.getMousePosition();
        this.mouseX = mousePos.x;
        this.mouseY = mousePos.y;
        this.mouseLeft = this.game.input.isMousePressed('left');

        // 更新UI元素状态
        this.updateElementStates();

        // 更新所有UI元素
        for (const element of this.uiElements) {
            if (element.update) {
                element.update(deltaTime);
            }
        }
    }

    updateElementStates() {
        let newHoverElement = null;
        let newActiveElement = null;

        // 检测鼠标悬停元素（从z-index最高的元素开始检测，确保上层元素优先）
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const element = this.uiElements[i];
            if (element.visible && this.isPointInElement(this.mouseX, this.mouseY, element)) {
                newHoverElement = element;
                break;
            }
        }

        // 更新悬停状态
        if (this.hoverElement !== newHoverElement) {
            if (this.hoverElement) {
                this.hoverElement.onMouseLeave();
            }
            if (newHoverElement) {
                newHoverElement.onMouseEnter();
            }
            this.hoverElement = newHoverElement;
        }

        // 检测激活元素
        if (this.mouseLeft) {
            newActiveElement = this.hoverElement;
        }

        // 更新激活状态
        if (this.activeElement !== newActiveElement) {
            if (this.activeElement) {
                this.activeElement.onMouseUp();
            }
            if (newActiveElement) {
                newActiveElement.onMouseDown();
            }
            this.activeElement = newActiveElement;
        }
    }

    isPointInElement(x, y, element) {
        if (!element.rect) return false;
        return x >= element.rect.x && x <= element.rect.x + element.rect.width &&
               y >= element.rect.y && y <= element.rect.y + element.rect.height;
    }

    render(ctx) {
        // 渲染所有UI元素
        for (const element of this.uiElements) {
            if (element.visible && element.render) {
                element.render(ctx);
            }
        }
    }

    // 辅助函数：调整颜色亮度
    adjustBrightness(color, amount) {
        // 移除#号
        color = color.replace('#', '');
        
        // 解析RGB分量
        let r = parseInt(color.substr(0, 2), 16);
        let g = parseInt(color.substr(2, 2), 16);
        let b = parseInt(color.substr(4, 2), 16);

        // 调整亮度
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        // 转换回十六进制并返回
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    clear() {
        for (const element of this.uiElements) {
            if (element.destroy) {
                element.destroy();
            }
        }
        this.uiElements = [];
        this.hoverElement = null;
        this.activeElement = null;
    }
}