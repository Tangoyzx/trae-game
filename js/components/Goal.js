// Goal组件，处理终点的特殊渲染
export class Goal {
    constructor() {
        this.name = 'goal';
        this.entity = null;
    }

    // 绘制终点
    draw(ctx) {
        const transform = this.entity.getComponent('transform');
        if (!transform) return;

        // 旗杆
        ctx.fillStyle = '#8B4513'; // 棕色
        ctx.fillRect(transform.x + transform.width/2 - 5, transform.y, 10, transform.height);
        
        // 旗帜
        ctx.fillStyle = '#FF0000'; // 红色
        ctx.fillRect(transform.x, transform.y, transform.width, transform.height/2);
    }
}