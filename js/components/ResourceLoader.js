// 资源加载器，用于加载和管理游戏资源
export class ResourceLoader {
    constructor() {
        this.loadedResources = new Map();
        this.loadingPromises = [];
    }

    // 加载单个图像资源
    loadImage(key, url) {
        return new Promise((resolve, reject) => {
            if (this.loadedResources.has(key)) {
                resolve(this.loadedResources.get(key));
                return;
            }

            const image = new Image();
            image.onload = () => {
                this.loadedResources.set(key, image);
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Failed to load image: ${url}`));
            };
            image.src = url;
        });
    }

    // 批量加载图像资源
    loadImages(imageList) {
        const promises = Object.entries(imageList).map(([key, url]) => {
            return this.loadImage(key, url);
        });
        return Promise.all(promises);
    }

    // 加载JSON配置文件
    loadJSON(key, url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.loadedResources.set(key, data);
                return data;
            });
    }

    // 获取已加载的资源
    getResource(key) {
        return this.loadedResources.get(key);
    }

    // 检查资源是否已加载
    hasResource(key) {
        return this.loadedResources.has(key);
    }

    // 清除所有资源
    clearResources() {
        this.loadedResources.clear();
    }
}

// 动画配置管理器，用于管理动画配置
export class AnimationConfigManager {
    constructor(resourceLoader) {
        this.resourceLoader = resourceLoader;
        this.animationConfigs = new Map();
    }

    // 加载动画配置
    loadAnimationConfig(key, url) {
        return this.resourceLoader.loadJSON(key, url).then(config => {
            this.animationConfigs.set(key, config);
            return config;
        });
    }

    // 获取特定实体类型的动画配置
    getAnimationConfig(entityType) {
        return this.animationConfigs.get(entityType);
    }

    // 获取特定实体类型的特定动画状态配置
    getAnimation(entityType, animationState) {
        const config = this.animationConfigs.get(entityType);
        if (!config || !config.animations || !config.animations[animationState]) {
            return null;
        }
        return {
            ...config,
            ...config.animations[animationState]
        };
    }
}
