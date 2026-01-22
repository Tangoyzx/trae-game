class Player extends Entity {
    constructor() {
        super();
        this.name = "玩家";
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 50;
        this.maxMana = 50;
        this.strength = 10;
        this.defense = 5;
        this.speed = 5;
        this.buffs = [];
        this.equipment = {
            weapon: null,
            armor: null
        };
    }

    initialize() {
        // 初始化逻辑
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新增益效果
        this.updateBuffs(deltaTime);
    }

    // 更新增益效果
    updateBuffs(deltaTime) {
        for (let i = this.buffs.length - 1; i >= 0; i--) {
            const buff = this.buffs[i];
            buff.remainingTime -= deltaTime;
            
            // 如果增益效果过期，移除它
            if (buff.remainingTime <= 0) {
                this.buffs.splice(i, 1);
            }
        }
    }

    render(ctx) {
        super.render(ctx);
    }
}