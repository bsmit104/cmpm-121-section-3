import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  //spinner?: Phaser.Physics.Arcade.Sprite;
  spinner?: Phaser.GameObjects.Shape;
  purpleman?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
    // this.load.path = "./assets/";
    // this.load.image('shrek', 'shrek.png');
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    //this.spinner = this.physics.add.sprite(320, 420, 'shrek');
    this.spinner = this.add.rectangle(320, 420, 15, 15, 0xf800d3);

    this.purpleman = this.add.rectangle(0, 0, 100, 20, 0x800080);
    this.purpleman.setOrigin(0, 0);
    this.purpleman.y = 0;

    // Add a tween to make the purple rectangle move across the top of the screen
    this.tweens.add({
      targets: this.purpleman,
      x: this.game.config.width as number,
      duration: 3000, // Adjust the duration as needed
      repeat: -1, // -1 means it will repeat indefinitely
      yoyo: true, // It will return to the start position and repeat
    });
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      if (this.spinner) {
        this.spinner!.rotation -= delta * this.rotationSpeed;
        this.spinner.x -= delta * 0.5;
        if (this.spinner.x < 0) {
          this.spinner.x = this.game.config.width as number;
        }
      }
    }
    if (this.right!.isDown) {
      if (this.spinner) {
        this.spinner!.rotation += delta * this.rotationSpeed;
        this.spinner.x += delta * 0.5;
        if (this.spinner.x > (this.game.config.width as number)) {
          this.spinner.x = 0;
        }
      }
    }

    //asked chatgpt
    if (this.fire!.isDown) {
      if (this.spinner) {
        this.tweens.add({
          targets: this.spinner,
          y: 0,
          duration: 1000,
          ease: Phaser.Math.Easing.Sine.Out,
          onComplete: () => {
            this.tweens.add({
              targets: this.spinner,
              y: 420,
              duration: 1000,
              ease: Phaser.Math.Easing.Sine.Out,
            });
          },
        });
      }
    }
  }
}
