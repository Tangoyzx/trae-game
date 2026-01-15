// Render组件，处理实体的渲染
export class Render {
    constructor(options = {}) {
        this.name = 'render';
        this.entity = null;
        this.type = options.type || 'rectangle'; // rectangle, circle, sprite
        this.color = options.color || '#000000';
        this.texture = options.texture || null;
        this.opacity = options.opacity || 1;
    }

    // 绘制实体
    draw(ctx) {
        const transform = this.entity.getComponent('transform');
        if (!transform) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // 应用旋转和缩放
        ctx.translate(transform.x + transform.width * transform.scaleX / 2, transform.y + transform.height * transform.scaleY / 2);
        ctx.rotate(transform.angle);
        ctx.scale(transform.scaleX, transform.scaleY);

        // 绘制基于中心点偏移
        switch (this.type) {
            case 'rectangle':
                this.drawRectangle(ctx, transform);
                break;
            case 'circle':
                this.drawCircle(ctx, transform);
                break;
            case 'sprite':
                this.drawSprite(ctx, transform);
                break;
        }

        ctx.restore();
    }

    // 绘制矩形
    drawRectangle(ctx, transform) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
    }

    // 绘制圆形
    drawCircle(ctx, transform) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(transform.width, transform.height) / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制精灵（纹理）
    drawSprite(ctx, transform) {
        if (this.texture) {
            ctx.drawImage(this.texture, -transform.width / 2, -transform.height / 2, transform.width, transform.height);
        } else {
            // 如果没有纹理，默认绘制矩形
            this.drawRectangle(ctx, transform);
        }
    }
}