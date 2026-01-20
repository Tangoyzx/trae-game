class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.camera = null;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    renderEntities(entities) {
        for (const entity of entities) {
            entity.render(this.ctx);
        }
    }

    renderMap(map) {
        const tileSize = map.tileSize;
        const cameraPos = this.camera ? this.camera.position : { x: 0, y: 0 };
        const startX = Math.max(0, Math.floor((cameraPos.x - this.width / 2) / tileSize));
        const startY = Math.max(0, Math.floor((cameraPos.y - this.height / 2) / tileSize));
        const endX = Math.min(map.width, Math.ceil((cameraPos.x + this.width / 2) / tileSize) + 1);
        const endY = Math.min(map.height, Math.ceil((cameraPos.y + this.height / 2) / tileSize) + 1);
        
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const tile = map.getTile(x, y);
                if (tile) {
                    const screenX = x * tileSize - cameraPos.x + this.width / 2;
                    const screenY = y * tileSize - cameraPos.y + this.height / 2;
                    
                    this.ctx.fillStyle = tile === 1 ? '#8B4513' : '#000'; // 1: 土地, 0: 空
                    this.ctx.fillRect(screenX, screenY, tileSize, tileSize);
                    
                    // 绘制网格线
                    this.ctx.strokeStyle = '#333';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.strokeRect(screenX, screenY, tileSize, tileSize);
                }
            }
        }
    }

    getScreenPosition(worldPos) {
        if (!this.camera) return worldPos;
        
        return {
            x: worldPos.x - this.camera.position.x + this.width / 2,
            y: worldPos.y - this.camera.position.y + this.height / 2
        };
    }

    getWorldPosition(screenPos) {
        if (!this.camera) return screenPos;
        
        return {
            x: screenPos.x + this.camera.position.x - this.width / 2,
            y: screenPos.y + this.camera.position.y - this.height / 2
        };
    }
}