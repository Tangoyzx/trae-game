class Item {
    constructor(config, quantity = 1) {
        this.id = config.id;
        this.name = config.name;
        this.type = config.type;
        this.rarity = config.rarity;
        this.description = config.description;
        this.effect = config.effect;
        this.icon = config.icon;
        this.stackable = config.stackable || false;
        this.maxStack = config.maxStack || 1;
        this.quantity = quantity;
    }

    // 使用物品
    use(user) {
        switch (this.effect.type) {
            case 'heal':
                this.useHeal(user);
                break;
            case 'mana':
                this.useMana(user);
                break;
            case 'buff':
                this.useBuff(user);
                break;
            case 'damage':
                this.useDamage(user);
                break;
            case 'defense':
                this.useDefense(user);
                break;
            case 'currency':
                this.useCurrency(user);
                break;
            case 'material':
                this.useMaterial(user);
                break;
            default:
                console.log(`未知的物品效果类型: ${this.effect.type}`);
        }

        // 消耗品使用后减少数量
        if (this.type === 'consumable') {
            this.removeQuantity(1);
        }

        return this.quantity > 0;
    }

    // 治疗效果
    useHeal(user) {
        if (user.health !== undefined) {
            if (this.effect.value === 'full') {
                user.health = user.maxHealth || 100;
            } else {
                user.health = Math.min(
                    user.health + this.effect.value,
                    user.maxHealth || 100
                );
            }
            console.log(`${user.name} 使用了 ${this.name}，恢复了生命值`);
        }
    }

    // 魔法值恢复效果
    useMana(user) {
        if (user.mana !== undefined) {
            user.mana = Math.min(
                user.mana + this.effect.value,
                user.maxMana || 50
            );
            console.log(`${user.name} 使用了 ${this.name}，恢复了魔法值`);
        }
    }

    // 增益效果
    useBuff(user) {
        if (!user.buffs) {
            user.buffs = [];
        }

        // 添加增益效果
        user.buffs.push({
            attribute: this.effect.attribute,
            value: this.effect.value,
            duration: this.effect.duration,
            remainingTime: this.effect.duration
        });

        console.log(`${user.name} 使用了 ${this.name}，获得了${this.effect.duration}秒的${this.effect.attribute}增益`);
    }

    // 武器伤害效果
    useDamage(user) {
        // 装备武器逻辑
        if (user.equipment) {
            user.equipment.weapon = this;
            console.log(`${user.name} 装备了 ${this.name}`);
        }
    }

    // 防具防御效果
    useDefense(user) {
        // 装备防具逻辑
        if (user.equipment) {
            user.equipment.armor = this;
            console.log(`${user.name} 装备了 ${this.name}`);
        }
    }

    // 货币使用效果
    useCurrency(user) {
        console.log(`${user.name} 使用了 ${this.quantity}个${this.name}`);
        // 货币使用逻辑，比如交易
    }

    // 材料使用效果
    useMaterial(user) {
        console.log(`${user.name} 使用了 ${this.quantity}个${this.name}`);
        // 材料使用逻辑，比如合成
    }

    // 检查是否可以与其他物品堆叠
    canStack(otherItem) {
        return this.stackable && otherItem.id === this.id;
    }

    // 增加物品数量
    addQuantity(amount) {
        if (!this.stackable) return false;
        
        const newQuantity = this.quantity + amount;
        this.quantity = Math.min(newQuantity, this.maxStack);
        return newQuantity <= this.maxStack;
    }

    // 减少物品数量
    removeQuantity(amount) {
        this.quantity = Math.max(0, this.quantity - amount);
        return this.quantity === 0;
    }

    // 渲染物品图标
    render(ctx, x, y, size) {
        // 绘制背景
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, size, size);

        // 绘制物品图标
        ctx.fillStyle = this.icon;
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);

        // 绘制数量（如果可堆叠且数量大于1）
        if (this.stackable && this.quantity > 1) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.quantity.toString(), x + size - 2, y + size - 2);
        }

        // 绘制边框（根据稀有度）
        let borderColor = '#888';
        switch (this.rarity) {
            case 'common':
                borderColor = '#888';
                break;
            case 'uncommon':
                borderColor = '#00ff00';
                break;
            case 'rare':
                borderColor = '#0000ff';
                break;
            case 'epic':
                borderColor = '#a335ee';
                break;
            case 'legendary':
                borderColor = '#ff8000';
                break;
        }
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
    }
}