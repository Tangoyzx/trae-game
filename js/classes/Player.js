import { Entity } from '../components/Entity.js';
import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { SpriteAnimator } from '../components/SpriteAnimator.js';
import { PlayerControl } from '../components/PlayerControl.js';

// 玩家类，使用组件组合
export class Player extends Entity {
    constructor(x, y) {
        super();

        // 添加组件
        this.addComponent(new Transform({ x, y, width: 32, height: 32 }))
            .addComponent(new Physics())
            .addComponent(new SpriteAnimator({
                type: 'spriteAnimator',
                color: '#4169E1',
                initialAnimation: 'idle',
                animations: {
                    idle: {
                        row: 0,
                        frameCount: 4,
                        frameRate: 8,
                        loop: true
                    },
                    walk: {
                        row: 1,
                        frameCount: 8,
                        frameRate: 12,
                        loop: true
                    },
                    jump: {
                        row: 2,
                        frameCount: 2,
                        frameRate: 10,
                        loop: false
                    },
                    fall: {
                        row: 3,
                        frameCount: 2,
                        frameRate: 10,
                        loop: false
                    },
                    death: {
                        row: 4,
                        frameCount: 6,
                        frameRate: 15,
                        loop: false
                    }
                }
            }))
            .addComponent(new PlayerControl());
    }

    // 更新玩家动画状态
    updateAnimation() {
        const animator = this.getComponent('spriteAnimator');
        const physics = this.getComponent('physics');
        
        if (!animator || !physics) return;
        
        const { velocityX, velocityY, onGround } = physics;
        
        // 根据物理状态确定动画状态
        let animationState = 'idle';
        
        if (velocityY < 0) {
            animationState = 'jump';
        } else if (velocityY > 0) {
            animationState = 'fall';
        } else if (!onGround) {
            animationState = 'fall';
        } else if (Math.abs(velocityX) > 0.1) {
            animationState = 'walk';
        } else {
            animationState = 'idle';
        }
        
        // 播放对应的动画
        animator.playAnimation(animationState);
        
        // 处理水平翻转
        animator.setFlipHorizontal(velocityX < 0);
    }

    // 重置玩家
    reset() {
        const transform = this.getComponent('transform');
        const physics = this.getComponent('physics');
        const playerControl = this.getComponent('playerControl');
        const animator = this.getComponent('spriteAnimator');
        
        if (transform && physics) {
            transform.x = 50;
            transform.y = 50;
            physics.velocityX = 0;
            physics.velocityY = 0;
            physics.onGround = false;
        }
        
        if (playerControl) {
            playerControl.score = 0;
        }
        
        if (animator) {
            animator.playAnimation('idle');
            animator.setFlipHorizontal(false);
        }
    }

    // 获取分数
    getScore() {
        const playerControl = this.getComponent('playerControl');
        return playerControl ? playerControl.score : 0;
    }

    // 更新玩家
    update(deltaTime) {
        super.update(deltaTime);
        this.updateAnimation();
    }
}