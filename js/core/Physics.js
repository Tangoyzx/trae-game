class Physics {
    constructor(game) {
        this.game = game;
        this.gravity = 0.8;
        this.tileSize = 32;
    }

    update(deltaTime) {
        // 遍历所有实体，更新物理状态
        for (const entity of this.game.entities) {
            const physicsBody = entity.getComponent('PhysicsBody');
            if (!physicsBody || !physicsBody.enabled) continue;
            
            const transform = entity.getComponent('Transform');
            if (!transform) continue;
            
            this.updatePhysicsBody(physicsBody, transform);
        }
    }

    updatePhysicsBody(physicsBody, transform) {
        physicsBody.onGround = false; // 每帧开始时重置状态
        const position = transform.position;
        const velocity = physicsBody.velocity;
        const size = physicsBody.size;
        
        // 1. 应用重力
        velocity.y += this.gravity;
        
        // 2. 水平方向移动
        const newX = position.x + velocity.x;
        if (!this.checkTileCollision(newX, position.y, size.width, size.height)) {
            position.x = newX;
        } else {
            // 碰撞到地形，对齐到网格
            if (velocity.x > 0) {
                // 向右移动时，对齐到阻挡格的左边缘
                position.x = Math.floor((newX + size.width) / this.tileSize) * this.tileSize - size.width;
            } else if (velocity.x < 0) {
                // 向左移动时，对齐到阻挡格的右边缘
                position.x = Math.ceil(newX / this.tileSize) * this.tileSize;
            }
            velocity.x = 0;
        }
        
        // 3. 垂直方向移动
        const newY = position.y + velocity.y;
        if (!this.checkTileCollision(position.x, newY, size.width, size.height)) {
            position.y = newY;
        } else {
            // 碰撞到地形，对齐到网格
            if (velocity.y > 0) {
                position.y = Math.floor((newY + size.height) / this.tileSize) * this.tileSize - size.height;
                physicsBody.onGround = true; // 落地

            } else if (velocity.y < 0) {
                position.y = Math.ceil(newY / this.tileSize) * this.tileSize;

            }
            velocity.y = 0;
        }
        
        // 4. 最后检查当前位置是否与地形碰撞（防止卡在地形中）
        if (this.checkTileCollision(position.x, position.y, size.width, size.height)) {
            // 瞬移到最近的无阻挡区域
            const closestPos = this.findClosestNonCollidingPosition(position.x, position.y, size.width, size.height);
            transform.position.x = closestPos.x;
            transform.position.y = closestPos.y;
            velocity.x = 0;
            velocity.y = 0;
            physicsBody.onGround = true; // 确保瞬移后在地面上
        }
    }

    checkTileCollision(x, y, width, height) {
        // 检查实体与地形的碰撞
        const startX = Math.floor(x / this.tileSize);
        const startY = Math.floor(y / this.tileSize);
        const endX = Math.ceil((x + width) / this.tileSize);
        const endY = Math.ceil((y + height) / this.tileSize);
        
        for (let i = startX; i < endX; i++) {
            for (let j = startY; j < endY; j++) {
                if (this.game.map.isSolid(i, j)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    findClosestNonCollidingPosition(x, y, width, height) {
        // 简单实现：向四个方向寻找最近的无碰撞位置
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
        
        let closestDistance = Infinity;
        let closestPos = { x, y };
        
        for (const dir of directions) {
            let distance = 0;
            let testX = x;
            let testY = y;
            
            while (distance < 100) { // 最大搜索距离
                distance++;
                testX += dir.x * this.tileSize;
                testY += dir.y * this.tileSize;
                
                if (!this.checkTileCollision(testX, testY, width, height)) {
                    const dist = Math.sqrt(Math.pow(testX - x, 2) + Math.pow(testY - y, 2));
                    if (dist < closestDistance) {
                        closestDistance = dist;
                        closestPos = { x: testX, y: testY };
                    }
                    break;
                }
            }
        }
        
        return closestPos;
    }
}