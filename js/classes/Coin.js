import { Entity } from '../components/Entity.js';
import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Coin as CoinComponent } from '../components/Coin.js';
import { Rotation } from '../components/Rotation.js';

// 金币类，使用组件组合
export class Coin extends Entity {
    constructor(x, y) {
        super();

        // 添加组件
        this.addComponent(new Transform({ x, y, width: 20, height: 20 }))
            .addComponent(new Physics({ applyGravity: false }))
            .addComponent(new Rotation())
            .addComponent(new CoinComponent());
    }
}