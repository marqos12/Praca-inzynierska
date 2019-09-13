
import Phaser from "../../phaser/phaser.min.js";

export class FixedPlate extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture) { 
      super(scene, x, y, 'plates',texture)
      this.setInteractive()
      this.scene = scene;
    }

    update(){
      //if(this.scene.input.activePointer.buttons>0)console.log(this.scene.input.activePointer)
      //if(this.scene.input.activePointer.leftButton.isDown) console.log("kutaas")
    }

    makeScale(scale){
      let oldWidth = this.displayWidth;
      this.setScale(scale);
      let newWidth = this.displayWidth;
      this.x-=window.innerWidth/2
      this.y-=window.innerHeight/2
      this.x =this.x/oldWidth*newWidth;
      this.y =this.y/oldWidth*newWidth;

      this.x+=window.innerWidth/2
      this.y+=window.innerHeight/2

    }
  }