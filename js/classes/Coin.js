// 金币类
export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.angle = 0;
    }

    // 绘制金币
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#FFD700'; // 金色
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFA500'; // 橙色
        ctx.beginPath();
        ctx.arc(0, 0, this.width/3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        this.angle += 0.1;
    }
}