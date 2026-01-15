import { Entity } from '../components/Entity.js';
import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Render } from '../components/Render.js';

// 平台类，使用组件组合
export class Platform extends Entity {
    constructor(x, y, width, height) {
        super();

        // 添加组件
        this.addComponent(new Transform({ x, y, width, height }))
            .addComponent(new Physics({ applyGravity: false }))
            .addComponent(new Render({ color: '#32CD32' })); // 绿色
    }
}