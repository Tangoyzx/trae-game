// Coin组件，处理金币的特殊渲染和收集逻辑
export class Coin {
    constructor() {
        this.name = 'coin';
        this.entity = null;
    }

    // 绘制金币
    draw(ctx) {
        const transform = this.entity.getComponent('transform');
        const rotation = this.entity.getComponent('rotation');
        
        if (!transform) return;

        ctx.save();
        
        // 应用旋转
        ctx.translate(transform.x + transform.width / 2, transform.y + transform.height / 2);
        if (rotation) {
            ctx.rotate(rotation.angle);
        }
        
        // 绘制金币外环
        ctx.fillStyle = '#FFD700'; // 金色
        ctx.beginPath();
        ctx.arc(0, 0, transform.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制金币内环
        ctx.fillStyle = '#FFA500'; // 橙色
        ctx.beginPath();
        ctx.arc(0, 0, transform.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}