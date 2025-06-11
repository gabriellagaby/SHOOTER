const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [SceneMenu, ScenePilihHero, ScenePlay, SceneGameOver],
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};

const game = new Phaser.Game(config);
