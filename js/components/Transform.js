// Transform组件，整合Position、Rotation功能并添加Scale
export class Transform {
    constructor(options = {}) {
        this.name = 'transform';
        this.entity = null;
        
        // Position属性
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 30;
        this.height = options.height || 30;
        
        // Rotation属性
        this.angle = options.angle || 0;
        
        // Scale属性
        this.scaleX = options.scaleX || 1;
        this.scaleY = options.scaleY || 1;
    }

    // 更新旋转
    update(deltaTime) {
        // 如果有旋转速度，可以在这里更新角度
        // 目前保持不变，由Rotation组件的逻辑处理
    }

    // 获取中心点位置
    getCenter() {
        return {
            x: this.x + this.width * this.scaleX / 2,
            y: this.y + this.height * this.scaleY / 2
        };
    }

    // 设置位置
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // 设置尺寸
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    // 设置缩放
    setScale(scaleX, scaleY = scaleX) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    // 设置旋转角度
    setRotation(angle) {
        this.angle = angle;
    }
}