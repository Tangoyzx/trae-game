import { Entity } from '../components/Entity.js';
import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Goal as GoalComponent } from '../components/Goal.js';

// 终点类，使用组件组合
export class Goal extends Entity {
    constructor(x, y) {
        super();

        // 添加组件
        this.addComponent(new Transform({ x, y, width: 40, height: 60 }))
            .addComponent(new Physics({ applyGravity: false }))
            .addComponent(new GoalComponent());
    }
}