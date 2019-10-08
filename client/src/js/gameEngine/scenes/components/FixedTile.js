

export class FixedTile extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture) { 
      super(scene, x, y, 'tiles',texture)
      this.setInteractive()
      this.scene = scene;
    }

    update(){

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