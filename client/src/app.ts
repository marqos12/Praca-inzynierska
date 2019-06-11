import "phaser";
import { GameScene } from "./gameScene";
import { MenuScene } from "./menuScene";
import { LoginScene } from "./loginScene";

const config: GameConfig = {
  title: "mojrzeszow",
  type: Phaser.AUTO,
  //width: window.innerWidth,
  //height: window.innerHeight,
  width:1920,
  height:1080,
  parent: "game",
  scene: [MenuScene, GameScene, LoginScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#3131ff"
};

export class MojrzeszowTheGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new MojrzeszowTheGame(config);
};