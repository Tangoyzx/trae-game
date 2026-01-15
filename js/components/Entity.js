// Entity基类，用于管理组件
export class Entity {
    constructor() {
        this.components = new Map();
        this.id = Math.random().toString(36).substr(2, 9);
    }

    // 添加组件
    addComponent(component) {
        this.components.set(component.name, component);
        component.entity = this;
        return this;
    }

    // 获取组件
    getComponent(name) {
        return this.components.get(name);
    }

    // 检查是否有组件
    hasComponent(name) {
        return this.components.has(name);
    }

    // 更新所有组件
    update(deltaTime, ...args) {
        for (const component of this.components.values()) {
            if (component.update) {
                component.update(deltaTime, ...args);
            }
        }
    }

    // 绘制所有组件
    draw(ctx) {
        for (const component of this.components.values()) {
            if (component.draw) {
                component.draw(ctx);
            }
        }
    }
}