class AI extends Component {
    constructor(target) {
        super();
        this.target = target;
        this.speed = 3;
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        if (!this.target) return;
        
        const transform = this.entity.getComponent('Transform');
        const physicsBody = this.entity.getComponent('PhysicsBody');
        const movement = this.entity.getComponent('Movement');
        if (!transform || !physicsBody || !movement) return;
        
        const targetTransform = this.target.getComponent('Transform');
        if (!targetTransform) return;
        
        // 朝向目标移动
        const dx = targetTransform.position.x - transform.position.x;
        const dy = targetTransform.position.y - transform.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // 设置水平速度
            const moveDir = Math.sign(dx);
            physicsBody.velocity.x = moveDir * this.speed;
            
            // 检测前方是否有掉落或阻挡
            if (physicsBody.onGround) {
                // 获取地图信息
                const game = this.entity.game;
                if (game && game.map) {
                    const map = game.map;
                    const tileSize = map.tileSize;
                    
                    // 计算当前位置的格子坐标
                    const currentTileX = Math.floor(transform.position.x / tileSize);
                    const currentTileY = Math.floor(transform.position.y / tileSize);
                    
                    // 计算前方格子坐标（更准确的计算方式）
                    const frontTileX = Math.floor((transform.position.x + moveDir * (physicsBody.size.width + 10)) / tileSize);
                    const frontTileY = Math.floor(transform.position.y / tileSize);
                    
                    // 计算前方格子下方的格子坐标（检测掉落）
                    const frontBelowTileY = frontTileY + 1;
                    
                    // 计算当前位置下方的格子坐标
                    const currentBelowTileY = currentTileY + 1;
                    
                    // 检测前方是否有阻挡
                    const frontHasBlock = map.getTile(frontTileX, frontTileY) === 1;
                    
                    // 检测前方是否有掉落（下一个格子没有地面）
                    const frontHasDrop = map.getTile(frontTileX, frontBelowTileY) === 0;
                    
                    // 检测当前位置是否在边缘
                    const currentOnEdge = map.getTile(currentTileX + moveDir, currentBelowTileY) === 0;
                    
                    // 如果前方有阻挡、有掉落或者在边缘，尝试跳跃
                    if (frontHasBlock || frontHasDrop || currentOnEdge) {
                        movement.jump();
                    }
                }
            }
        }
    }

    render(ctx) {
        // 不需要渲染
    }
}