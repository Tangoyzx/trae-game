// Rotation组件，处理实体的旋转效果，更新Transform组件的angle属性
export class Rotation {
    constructor(options = {}) {
        this.name = 'rotation';
        this.entity = null;
        this.rotationSpeed = options.rotationSpeed || 0.1;
    }

    // 更新旋转，修改Transform组件的angle属性
    update(deltaTime) {
        const transform = this.entity.getComponent('transform');
        if (transform) {
            transform.angle += this.rotationSpeed;
        }
    }
}