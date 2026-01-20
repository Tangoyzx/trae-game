class Entity {
    constructor() {
        this.components = {};
        this.active = true;
    }

    addComponent(component) {
        const componentName = component.constructor.name;
        this.components[componentName] = component;
        component.setEntity(this);
        component.initialize();
        return this;
    }

    getComponent(componentName) {
        return this.components[componentName];
    }

    removeComponent(componentName) {
        if (this.components[componentName]) {
            this.components[componentName].destroy();
            delete this.components[componentName];
        }
    }

    update(deltaTime) {
        if (!this.active) return;
        
        for (const componentName in this.components) {
            this.components[componentName].update(deltaTime);
        }
    }

    render(ctx) {
        if (!this.active) return;
        
        for (const componentName in this.components) {
            this.components[componentName].render(ctx);
        }
    }

    destroy() {
        this.active = false;
        
        for (const componentName in this.components) {
            this.components[componentName].destroy();
        }
        
        this.components = {};
    }
}