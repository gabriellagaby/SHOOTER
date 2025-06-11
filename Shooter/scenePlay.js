var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePlay" });
    },

    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("BG1", "BG1.png");
        this.load.image("BG2", "BG2.png");
        this.load.image("BG3", "BG3.png");
        this.load.image("Transisi", "Transisi.png");
        this.load.image("Pesawat1", "Pesawat1.png");
        this.load.image("Pesawat2", "Pesawat2.png");
        this.load.image("Peluru", "Peluru.png");
        this.load.image("EfekLedakan", "EfekLedakan.png");
        this.load.image("Musuh1", "Musuh1.png");
        this.load.image("Musuh2", "Musuh2.png");
        this.load.image("Musuh3", "Musuh3.png");
        this.load.image("MusuhBos", "MusuhBos.png");
        this.load.audio("snd_shoot", "music_menu.mp3");
        this.load.audio("snd_explode", "fx_explode.mp3");
        this.load.audio("snd_play", "music_play.mp3");
    },

    create: function () {
        this.arrBgBottom = [];
        this.arrBullets = [];
        this.arrayEnemies = [];
        this.scoreValue = 0;

        const X_POSITION = {
            LEFT: 0,
            CENTER: this.sys.game.config.width / 2,
            RIGHT: this.sys.game.config.width
        };
        const Y_POSITION = {
            TOP: 0,
            CENTER: this.sys.game.config.height / 2,
            BOTTOM: this.sys.game.config.height
        };

        // Background
        this.bgBottomSize = { width: 768, height: 1664 };
        this.lastBgIndex = Phaser.Math.Between(1, 3);
        this.createBgBottom = (xPos, yPos) => {
            let bgBottom = this.add.image(xPos, yPos, 'BG' + this.lastBgIndex);
            bgBottom.setData('kecepatan', 3);
            bgBottom.setDepth(0);
            this.arrBgBottom.push(bgBottom);
            this.lastBgIndex = Phaser.Math.Between(1, 3);
        };
        this.addBgBottom = () => {
            let y = this.arrBgBottom.length > 0
                ? this.arrBgBottom[this.arrBgBottom.length - 1].y - this.bgBottomSize.height
                : this.sys.game.config.height / 2;
            this.createBgBottom(X_POSITION.CENTER, y);
        };
        this.addBgBottom(); this.addBgBottom(); this.addBgBottom();

        // Skor
        this.scoreLabel = this.add.text(X_POSITION.CENTER, Y_POSITION.TOP + 60, '0', {
            fontFamily: 'Verdana, Arial',
            fontSize: '60px',
            color: '#ffffff',
            stroke: '#222',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        // Bullet
        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize: function Bullet(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene, x, y, 'Peluru');
                this.setDepth(3).setScale(0.5);
                scene.physics.world.enable(this);
                this.body.setVelocityY(-600);
                this.body.setAllowGravity(false);
            },
            move: function () {
                if (this.y < -50) {
                    this.destroy();
                }
            }
        });

        this.time.addEvent({
            delay: 250,
            callback: function () {
                if (!this.heroShip.active) return;
                let bullet = new Bullet(this, this.heroShip.x, this.heroShip.y - 30);
                this.add.existing(bullet);
                this.arrBullets.push(bullet);
            },
            callbackScope: this,
            loop: true
        });

        // Enemy Path
        let w = this.sys.game.config.width, h = this.sys.game.config.height, m = 40;
        let paths = [
            [new Phaser.Math.Vector2(m, m), new Phaser.Math.Vector2(m + 100, h * 0.3), new Phaser.Math.Vector2(w * 0.4, h * 0.6), new Phaser.Math.Vector2(w * 0.3, h - m)],
            [new Phaser.Math.Vector2(w - m, m), new Phaser.Math.Vector2(w - m - 100, h * 0.3), new Phaser.Math.Vector2(w * 0.6, h * 0.6), new Phaser.Math.Vector2(w * 0.7, h - m)],
            [new Phaser.Math.Vector2(w * 0.5, m), new Phaser.Math.Vector2(w * 0.7, h * 0.3), new Phaser.Math.Vector2(w * 0.3, h * 0.6), new Phaser.Math.Vector2(w * 0.5, h - m)],
            [new Phaser.Math.Vector2(m, h * 0.5), new Phaser.Math.Vector2(w * 0.3, h * 0.3), new Phaser.Math.Vector2(w * 0.7, h * 0.7), new Phaser.Math.Vector2(w - m, h * 0.5)]
        ];

        var Enemy = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize: function Enemy(scene, idxPath) {
                Phaser.GameObjects.Image.call(this, scene);
                this.setTexture('Musuh' + Phaser.Math.Between(1, 3)).setDepth(4).setScale(0.35);
                this.curve = new Phaser.Curves.Spline(paths[idxPath]);
                this.Path = { t: 0, vec: new Phaser.Math.Vector2() };

                scene.tweens.add({
                    targets: this.Path,
                    t: 1,
                    duration: 3500,
                    onUpdate: () => {
                        this.curve.getPoint(this.Path.t, this.Path.vec);
                        this.setPosition(this.Path.vec.x, this.Path.vec.y);
                    },
                    onComplete: () => this.destroy()
                });
            },
            move: function () {}
        });

        this.time.addEvent({
            delay: 1000,
            callback: function () {
                let enemy = new Enemy(this, Phaser.Math.Between(0, paths.length - 1));
                this.add.existing(enemy);
                this.arrayEnemies.push(enemy);
            },
            callbackScope: this,
            loop: true
        });

        // Hero
        this.heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 100, 'Pesawat1');
        this.heroShip.setDepth(4).setScale(0.35).setActive(true);
        this.cursorsKeyListener = this.input.keyboard.createCursorKeys();

        // Input pointer
        this.input.on('pointermove', function (pointer) {
            if (!this.heroShip.active) return;
            let mx = Phaser.Math.Clamp(pointer.x, 70, this.sys.game.config.width - 70);
            let my = Phaser.Math.Clamp(pointer.y, 70, this.sys.game.config.height - 70);
            let dx = this.heroShip.x - mx, dy = this.heroShip.y - my;
            let d = Math.sqrt(dx * dx + dy * dy) * 0.8;
            this.tweens.add({ targets: this.heroShip, x: mx, y: my, duration: d });
        }, this);

        // Ledakan
        this.partikelExplode = this.add.particles('EfekLedakan.png').setDepth(4);
        this.emitterExplode1 = this.partikelExplode.createEmitter({
            speed: { min: -800, max: 800 }, angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 }, blendMode: 'SCREEN', lifespan: 200, tint: 0xffa500
        });
        this.emitterExplode2 = this.partikelExplode.createEmitter({
            speed: { min: -400, max: 400 }, angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 }, blendMode: 'SCREEN', lifespan: 300, tint: 0xffffff
        });
        this.emitterExplode1.explode(); this.emitterExplode2.explode();
    },

    update: function () {
        if (!this.heroShip.active) return;

        // Background
        for (let i = 0; i < this.arrBgBottom.length; i++) {
            this.arrBgBottom[i].y += this.arrBgBottom[i].getData('kecepatan');
            if (this.arrBgBottom[i].y > this.sys.game.config.height + this.bgBottomSize.height / 2) {
                this.arrBgBottom[i].destroy();
                this.arrBgBottom.splice(i, 1);
                this.addBgBottom();
                i--;
            }
        }

        // Bullets
        for (let i = 0; i < this.arrBullets.length; i++) {
            if (this.arrBullets[i] && this.arrBullets[i].move) {
                this.arrBullets[i].move();
                if (!this.arrBullets[i].active) {
                    this.arrBullets.splice(i, 1);
                    i--;
                }
            }
        }

        // Enemies
        for (let i = 0; i < this.arrayEnemies.length; i++) {
            if (this.arrayEnemies[i] && this.arrayEnemies[i].move) {
                this.arrayEnemies[i].move();
                if (!this.arrayEnemies[i].active) {
                    this.arrayEnemies.splice(i, 1);
                    i--;
                }
            }
        }

        // === Tambahkan deteksi peluru vs musuh di sini ===
        for (let i = 0; i < this.arrayEnemies.length; i++) {
            if (!this.arrayEnemies[i].active) continue;
            for (let j = 0; j < this.arrBullets.length; j++) {
                if (!this.arrBullets[j].active) continue;
                if (
                    Phaser.Geom.Intersects.RectangleToRectangle(
                        this.arrayEnemies[i].getBounds(),
                        this.arrBullets[j].getBounds()
                    )
                ) {
                    // Efek ledakan di posisi peluru
                    this.emitterExplode1.setPosition(this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emitterExplode2.setPosition(this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emitterExplode1.explode();
                    this.emitterExplode2.explode();

                    // Nonaktifkan musuh & peluru
                    this.arrayEnemies[i].setActive(false).setVisible(false);
                    this.arrBullets[j].setActive(false).setVisible(false);

                    // Tambah skor
                    this.scoreValue++;
                    this.scoreLabel.setText(this.scoreValue);

                    break;
                }
            }
        }

        // Hero vs musuh
        for (let i = 0; i < this.arrayEnemies.length; i++) {
            if (
                this.heroShip.active &&
                this.arrayEnemies[i].active &&
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.heroShip.getBounds(),
                    this.arrayEnemies[i].getBounds()
                )
            ) {
                this.emitterExplode1.setPosition(this.heroShip.x, this.heroShip.y);
                this.emitterExplode1.explode();

                this.heroShip.setActive(false).setVisible(false);
                this.arrayEnemies[i].setActive(false).setVisible(false);

                let highscore = localStorage.getItem('highscore') || 0;
                if (this.scoreValue > highscore) {
                    localStorage.setItem('highscore', this.scoreValue);
                }

                this.time.delayedCall(700, () => {
                    this.scene.start('sceneGameOver', {
                        score: this.scoreValue,
                        highscore: Math.max(this.scoreValue, highscore)
                    });
                });

                return;
            }
        }

        // Kontrol keyboard
        if (this.cursorsKeyListener.left.isDown && this.heroShip.x > 70) this.heroShip.x -= 7;
        if (this.cursorsKeyListener.right.isDown && this.heroShip.x < this.sys.game.config.width - 70) this.heroShip.x += 7;
        if (this.cursorsKeyListener.up.isDown && this.heroShip.y > 70) this.heroShip.y -= 7;
        if (this.cursorsKeyListener.down.isDown && this.heroShip.y < this.sys.game.config.height - 70) this.heroShip.y += 7;
    }
});