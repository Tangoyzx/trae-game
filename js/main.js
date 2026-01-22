// 确保Entity、Component等类在全局作用域可用
window.Entity = Entity;
window.Component = Component;
window.Transform = Transform;
window.RendererComponent = RendererComponent;
window.PlayerInput = PlayerInput;
window.Movement = Movement;
window.PhysicsBody = PhysicsBody;
window.AI = AI;
window.Player = Player;
window.Enemy = Enemy;
window.Renderer = Renderer;
window.Input = Input;
window.Physics = Physics;
window.Camera = Camera;
window.MapGenerator = MapGenerator;
window.Game = Game;

// UI相关类
window.UIManager = UIManager;
window.UIPanel = UIPanel;
window.UIButton = UIButton;
window.Inventory = Inventory;
window.InventorySlot = InventorySlot;

// 物品相关类
window.Item = Item;
window.ItemFactory = ItemFactory;
window.ItemConfigs = ItemConfigs;

// 全局物品工厂实例
window.itemFactory = itemFactory;

// 游戏入口
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.initialize();
});