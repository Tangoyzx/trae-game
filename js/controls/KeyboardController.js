// 键盘状态跟踪
const keys = {
    a: false,
    d: false,
    space: false,
    r: false
};

// 键盘控制类
export class KeyboardController {
    constructor() {
        this.setupEventListeners();
    }

    // 设置键盘事件监听器
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 阻止游戏控制键的默认浏览器行为
            if (['a', 'd', ' ', 'r', 'A', 'D', 'R'].includes(e.key)) {
                e.preventDefault();
            }
            
            if (e.key === 'a' || e.key === 'A') {
                keys.a = true;
            } else if (e.key === 'd' || e.key === 'D') {
                keys.d = true;
            } else if (e.key === ' ') {
                keys.space = true;
            } else if (e.key === 'r' || e.key === 'R') {
                keys.r = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                keys.a = false;
            } else if (e.key === 'd' || e.key === 'D') {
                keys.d = false;
            } else if (e.key === ' ') {
                keys.space = false;
            } else if (e.key === 'r' || e.key === 'R') {
                keys.r = false;
            }
        });
    }

    // 获取R键状态
    isRKeyPressed() {
        return keys.r;
    }

    // 控制玩家移动
    controlPlayer(player) {
        // 停止默认移动
        player.stop();
        
        // 左右移动
        if (keys.a) {
            player.moveLeft();
        } else if (keys.d) {
            player.moveRight();
        }
        
        // 跳跃
        if (keys.space) {
            player.jump();
        }
    }
}