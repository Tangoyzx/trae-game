class Camera {
    constructor(game) {
        this.game = game;
        this.position = { x: 0, y: 0 };
        this.target = null;
        this.smoothness = 0.1; // 缓动系数
        this.firstFrame = true;
    }

    setTarget(target) {
        this.target = target;
    }

    update(deltaTime) {
        if (!this.target) return;
        
        const targetTransform = this.target.getComponent('Transform');
        if (!targetTransform) return;
        
        const targetPos = targetTransform.position;
        
        if (this.firstFrame) {
            // 首帧直接对齐
            this.position.x = targetPos.x;
            this.position.y = targetPos.y;
            this.firstFrame = false;
        } else {
            // 缓动居中
            this.position.x += (targetPos.x - this.position.x) * this.smoothness;
            this.position.y += (targetPos.y - this.position.y) * this.smoothness;
        }
        
        // 边界限制
        this.clampToMap();
    }

    clampToMap() {
        const map = this.game.map;
        if (!map) return;
        
        const halfWidth = this.game.renderer.width / 2;
        const halfHeight = this.game.renderer.height / 2;
        const mapWidth = map.width * map.tileSize;
        const mapHeight = map.height * map.tileSize;
        
        this.position.x = Math.max(halfWidth, Math.min(mapWidth - halfWidth, this.position.x));
        this.position.y = Math.max(halfHeight, Math.min(mapHeight - halfHeight, this.position.y));
    }
}