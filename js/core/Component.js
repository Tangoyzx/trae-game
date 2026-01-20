class Component {
    constructor() {
        this.entity = null;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    initialize() {
        // 初始化方法
    }

    update(deltaTime) {
        // 更新方法
    }

    render(ctx) {
        // 渲染方法
    }

    destroy() {
        // 销毁方法
    }
}