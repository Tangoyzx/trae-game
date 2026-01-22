class ItemFactory {
    constructor() {
        this.itemConfigs = ItemConfigs;
    }

    // 根据物品ID创建单个物品
    createItem(itemId, quantity = 1) {
        const config = this.itemConfigs[itemId];
        if (!config) {
            console.error(`找不到物品配置: ${itemId}`);
            return null;
        }

        return new Item(config, quantity);
    }

    // 根据物品ID批量创建物品
    createItems(itemDataArray) {
        return itemDataArray.map(itemData => 
            this.createItem(itemData.id, itemData.quantity)
        ).filter(item => item !== null);
    }

    // 创建随机物品
    createRandomItem() {
        const itemIds = Object.keys(this.itemConfigs).map(Number);
        const randomId = itemIds[Math.floor(Math.random() * itemIds.length)];
        return this.createItem(randomId);
    }

    // 获取物品配置
    getItemConfig(itemId) {
        return this.itemConfigs[itemId];
    }

    // 获取所有物品配置
    getAllItemConfigs() {
        return this.itemConfigs;
    }
}

// 全局物品工厂实例
const itemFactory = new ItemFactory();