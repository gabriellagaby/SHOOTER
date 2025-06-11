var scenePilihHero = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePilihHero" });
    },

    init: function () {},

    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image("BGPilihPesawat", "BGPilihPesawat.png");
        this.load.image("ButtonMenu", "ButtonMenu.png");
        this.load.image("ButtonNext", "ButtonNext.png");
        this.load.image("ButtonPrev", "ButtonPrev.png");
        this.load.image("Pesawat1", "Pesawat1.png");
        this.load.image("Pesawat2", "Pesawat2.png");
    },

    create: function () {
        // Inisialisasi posisi X dan Y jika belum ada
        if (typeof X_POSITION === "undefined" || typeof Y_POSITION === "undefined") {
            X_POSITION = {
                LEFT: 0,
                CENTER: this.sys.game.config.width / 2,
                RIGHT: this.sys.game.config.width
            };
            Y_POSITION = {
                TOP: 0,
                CENTER: this.sys.game.config.height / 2,
                BOTTOM: this.sys.game.config.height
            };
        }

        // Tambahkan background
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat');

        // Tambahkan tombol menu
        var buttonMenu = this.add.image(70, 70, 'ButtonMenu');
        buttonMenu.setInteractive();

        // Tambahkan tombol next
        var buttonNext = this.add.image(X_POSITION.CENTER + 200, Y_POSITION.CENTER, 'ButtonNext');
        buttonNext.setInteractive();

        // Tambahkan tombol previous
        var buttonPrevious = this.add.image(X_POSITION.CENTER - 200, Y_POSITION.CENTER, 'ButtonPrev');
        buttonPrevious.setInteractive();

        // Tambahkan pesawat hero berdasarkan pilihan
        var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1));
        heroShip.setInteractive();

        // Event tombol menu
        buttonMenu.on('pointerup', function () {
            this.scene.start('sceneMenu');
        }, this);

        // Event tombol next
        buttonNext.on('pointerup', function () {
            currentHero++;
            if (currentHero >= countHero) currentHero = 0;
            heroShip.setTexture('Pesawat' + (currentHero + 1));
        }, this);

        // Event tombol previous
        buttonPrevious.on('pointerup', function () {
            currentHero--;
            if (currentHero < 0) currentHero = countHero - 1;
            heroShip.setTexture('Pesawat' + (currentHero + 1));
        }, this);

        // Event klik pesawat untuk mulai main
        heroShip.on('pointerup', function () {
            this.scene.start('scenePlay');
        }, this);

        // Efek hover dan klik (opsional, agar tombol lebih interaktif)
        [buttonMenu, buttonNext, buttonPrevious, heroShip].forEach(function(btn) {
            btn.on('pointerover', function () { btn.setTint(0x999999); });
            btn.on('pointerout', function () { btn.setTint(0xffffff); });
            btn.on('pointerdown', function () { btn.setTint(0x555555); });
            btn.on('pointerup', function () { btn.setTint(0xffffff); });
        });
    },

    update: function () {}
});