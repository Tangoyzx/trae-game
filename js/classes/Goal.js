// 终点类
export class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
    }

    // 绘制终点
    draw(ctx) {
        // 旗杆
        ctx.fillStyle = '#8B4513'; // 棕色
        ctx.fillRect(this.x + this.width/2 - 5, this.y, 10, this.height);
        
        // 旗帜
        ctx.fillStyle = '#FF0000'; // 红色
        ctx.fillRect(this.x, this.y, this.width, this.height/2);
    }
}