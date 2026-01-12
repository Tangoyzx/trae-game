// 平台类
export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // 绘制平台
    draw(ctx) {
        ctx.fillStyle = '#32CD32'; // 绿色
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}