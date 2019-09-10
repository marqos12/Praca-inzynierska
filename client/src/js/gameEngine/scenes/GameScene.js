import store from "../../store";
import { Scene } from "../phaser/phaser.min.js";

export default class GameScene extends Scene {
  create() {
    const text = this.add.text(250, 250, "Toggle UI", {
      backgroundColor: "white",
      color: "blue",
      fontSize: 48
    });

    text.setInteractive({ useHandCursor: true });

    text.on("pointerup", () => {
     // store.dispatch({ type: TOGGLE_UI });
    });
  }
}
