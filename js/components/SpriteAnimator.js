import { Render } from './Render.js';

export class SpriteAnimator extends Render {
    constructor(options = {}) {
        super(options);

        this.name = 'spriteAnimator';
        this.type = 'spriteAnimator';
        this.texture = options.texture || null;
        this.frameWidth = options.frameWidth || 32;
        this.frameHeight = options.frameHeight || 32;
        this.currentFrame = 0;
        this.frameCount = options.frameCount || 1;
        this.frameRate = options.frameRate || 10;
        this.animationRow = options.animationRow || 0;
        this.playing = options.playing !== false;
        this.loop = options.loop !== false;
        this.onAnimationComplete = null;
        
        // 新增：多状态动画支持
        this.animations = options.animations || {};
        this.currentAnimation = options.initialAnimation || null;
        this.flipHorizontal = false;
        this.flipVertical = false;
        
        this.frameTimer = 0;
        this.currentTime = 0;
    }

    // 新增：设置动画配置
    setAnimations(animations) {
        this.animations = animations;
    }

    // 新增：切换动画状态
    playAnimation(animationName, restart = true) {
        if (this.currentAnimation === animationName && !restart) {
            return;
        }

        const animation = this.animations[animationName];
        if (!animation) {
            console.warn(`Animation "${animationName}" not found`);
            return;
        }

        this.currentAnimation = animationName;
        this.animationRow = animation.row;
        this.frameCount = animation.frameCount;
        this.frameRate = animation.frameRate || 10;
        this.loop = animation.loop !== false;
        this.playing = true;
        
        if (restart || this.currentFrame >= this.frameCount) {
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    // 新增：获取当前动画名称
    getCurrentAnimation() {
        return this.currentAnimation;
    }

    update(deltaTime) {
        if (!this.playing || this.frameCount <= 1) return;

        this.frameTimer += deltaTime;
        this.currentTime += deltaTime;

        const frameInterval = 1 / this.frameRate;

        if (this.frameTimer >= frameInterval) {
            this.frameTimer -= frameInterval;
            this.currentFrame++;

            if (this.currentFrame >= this.frameCount) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frameCount - 1;
                    this.playing = false;
                    if (this.onAnimationComplete) {
                        this.onAnimationComplete();
                    }
                }
            }
        }
    }

    draw(ctx) {
        const transform = this.entity.getComponent('transform');
        if (!transform) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        ctx.translate(transform.x + transform.width * transform.scaleX / 2, transform.y + transform.height * transform.scaleY / 2);
        ctx.rotate(transform.angle);
        
        // 新增：应用翻转
        ctx.scale(
            this.flipHorizontal ? -transform.scaleX : transform.scaleX,
            this.flipVertical ? -transform.scaleY : transform.scaleY
        );

        if (this.texture) {
            // 有纹理时绘制序列帧
            const sourceX = this.currentFrame * this.frameWidth;
            const sourceY = this.animationRow * this.frameHeight;

            ctx.drawImage(
                this.texture,
                sourceX, sourceY,
                this.frameWidth, this.frameHeight,
                -transform.width / 2, -transform.height / 2,
                transform.width, transform.height
            );
        } else {
            // 没有纹理时，默认绘制矩形（继承自Render组件的行为）
            ctx.fillStyle = this.color;
            ctx.fillRect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
        }

        ctx.restore();
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.playing = false;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    setAnimationRow(row) {
        this.animationRow = row;
        this.currentFrame = 0;
    }

    setFrameRate(fps) {
        this.frameRate = fps;
    }

    setFrameCount(count) {
        this.frameCount = count;
        if (this.currentFrame >= count) {
            this.currentFrame = count - 1;
        }
    }

    // 新增：设置水平翻转
    setFlipHorizontal(flip) {
        this.flipHorizontal = flip;
    }

    // 新增：设置垂直翻转
    setFlipVertical(flip) {
        this.flipVertical = flip;
    }

    // 新增：设置纹理
    setTexture(texture) {
        this.texture = texture;
    }
}
