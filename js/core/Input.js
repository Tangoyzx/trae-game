class Input {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            left: false,
            right: false
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 鼠标事件
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
        });
        
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
        });
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    isMousePressed(button) {
        return this.mouse[button] || false;
    }

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
}