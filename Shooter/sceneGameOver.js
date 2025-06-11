var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'sceneGameOver' });
    },

    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("bgPlay", "BGPlay.png");
    },

    init: function (data) {
        this.score = data.score || 0;
        this.highscore = data.highscore || 0;
    },

    create: function () {
    const w = this.sys.game.config.width;
    const h = this.sys.game.config.height;

    // Asumsi jalan di tengah, lebar 320px
    const roadWidth = 320;
    const roadCenterX = w / 2;

    // Background
    this.add.image(w / 2, h / 2, "bgPlay").setDisplaySize(w, h);

    // GAME OVER title
    this.add.text(roadCenterX, h / 2 - 120, "GAME OVER", {
        fontFamily: "Impact, Verdana, Arial, sans-serif",
        fontSize: "64px", // lebih kecil
        color: "#ff3333",
        stroke: "#000",
        strokeThickness: 8,
        shadow: {
            offsetX: 4,
            offsetY: 4,
            color: "#000",
            blur: 8,
            fill: true
        },
        wordWrap: { width: roadWidth, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // Score
    this.add.text(roadCenterX, h / 2 - 30, `Score: ${this.score}`, {
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: "36px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#222",
        strokeThickness: 4,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 4,
            fill: true
        },
        wordWrap: { width: roadWidth - 40, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // High Score
    this.add.text(roadCenterX, h / 2 + 20, `High Score: ${this.highscore}`, {
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: "28px",
        color: "#ffff33",
        fontStyle: "bold",
        stroke: "#222",
        strokeThickness: 4,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 4,
            fill: true
        },
        wordWrap: { width: roadWidth - 40, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // Tombol restart lebih kecil dan pas di tengah jalan
    const restartButton = this.add.text(roadCenterX, h / 2 + 90, "⟳  RESTART", {
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: "32px",
        color: "#00ff99",
        backgroundColor: "#222",
        fontStyle: "bold",
        padding: { left: 30, right: 30, top: 10, bottom: 10 },
        stroke: "#00cc66",
        strokeThickness: 4,
        shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 4,
            fill: true
        }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    restartButton.on('pointerover', () => {
        restartButton.setStyle({ backgroundColor: "#00ff99", color: "#222", stroke: "#fff" });
    });
    restartButton.on('pointerout', () => {
        restartButton.setStyle({ backgroundColor: "#222", color: "#00ff99", stroke: "#00cc66" });
    });
    restartButton.on('pointerdown', () => {
        this.scene.start('scenePlay');
    });
}
});