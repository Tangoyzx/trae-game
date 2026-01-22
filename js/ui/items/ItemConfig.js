// 物品配置表，定义所有物品的基本信息和效果
const ItemConfigs = {
    1: {
        id: 1,
        name: "生命药水",
        type: "consumable",
        rarity: "common",
        description: "恢复50点生命值",
        effect: {
            type: "heal",
            value: 50
        },
        icon: "#FF0000", // 临时使用颜色作为图标
        stackable: true,
        maxStack: 99
    },
    2: {
        id: 2,
        name: "力量药水",
        type: "consumable",
        rarity: "uncommon",
        description: "10秒内增加10点力量",
        effect: {
            type: "buff",
            attribute: "strength",
            value: 10,
            duration: 10
        },
        icon: "#FFA500",
        stackable: true,
        maxStack: 99
    },
    3: {
        id: 3,
        name: "魔法药水",
        type: "consumable",
        rarity: "common",
        description: "恢复30点魔法值",
        effect: {
            type: "mana",
            value: 30
        },
        icon: "#0000FF",
        stackable: true,
        maxStack: 99
    },
    4: {
        id: 4,
        name: "速度药水",
        type: "consumable",
        rarity: "uncommon",
        description: "15秒内增加移动速度",
        effect: {
            type: "buff",
            attribute: "speed",
            value: 2,
            duration: 15
        },
        icon: "#00FF00",
        stackable: true,
        maxStack: 99
    },
    5: {
        id: 5,
        name: "铁剑",
        type: "weapon",
        rarity: "common",
        description: "一把普通的铁剑",
        effect: {
            type: "damage",
            value: 15
        },
        icon: "#808080",
        stackable: false
    },
    6: {
        id: 6,
        name: "皮甲",
        type: "armor",
        rarity: "common",
        description: "提供基本防护的皮甲",
        effect: {
            type: "defense",
            value: 8
        },
        icon: "#A0522D",
        stackable: false
    },
    7: {
        id: 7,
        name: "金币",
        type: "currency",
        rarity: "common",
        description: "用于交易的金币",
        effect: {
            type: "currency"
        },
        icon: "#FFD700",
        stackable: true,
        maxStack: 999
    },
    8: {
        id: 8,
        name: "红宝石",
        type: "material",
        rarity: "rare",
        description: "珍贵的红宝石，可用于制作装备",
        effect: {
            type: "material"
        },
        icon: "#FF1493",
        stackable: true,
        maxStack: 99
    },
    9: {
        id: 9,
        name: "蓝宝石",
        type: "material",
        rarity: "rare",
        description: "珍贵的蓝宝石，可用于制作装备",
        effect: {
            type: "material"
        },
        icon: "#1E90FF",
        stackable: true,
        maxStack: 99
    },
    10: {
        id: 10,
        name: "治疗卷轴",
        type: "consumable",
        rarity: "rare",
        description: "恢复全部生命值",
        effect: {
            type: "heal",
            value: "full"
        },
        icon: "#FF69B4",
        stackable: true,
        maxStack: 99
    }
};

// 导出物品配置表
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemConfigs;
}