import { Game } from './game.js';

// 游戏入口函数
function initGame() {
    // 初始化游戏实例
    new Game();
}

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);