import { Scene } from "../phaser/phaser.min.js";
import { FixedTile } from "./components/FixedTile";
import { Hud } from "./components/Hud";
import comunicationEngine from "../comunicationEngine";
import store from "../../store";
import { wsSendMessage } from "../../actions/index.js";

export default class GameScene extends Scene {

  constructor() {
    super({
      key: "GameScene"
    });

    this.fixedTiles = [];
    this.hud;
    this.tiles = [];
    this.origDragPoint;
    this.x = 0;
    this.y = 0;
    this.stompClient;
    this.socket;
    this.myScale = 0.5;
    this.point0;
    this.id;
    this.login;

    this.comunicationEngine = comunicationEngine
    this.unsubscribe = store.subscribe(() => console.log(store.getState()))
  }

  create() {


    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        let tile = new FixedTile(this, (i * 150) - 15 * 150 + Math.floor(window.innerWidth / 2 / 150) * 150, j * 150 - 15 * 150 + Math.floor(window.innerHeight / 2 / 150) * 150, 'green' + Phaser.Math.Between(1, 2))
        tile.setAngle(Phaser.Math.Between(0, 3) * 90)
        this.fixedTiles.push(tile);
        this.add.existing(tile.setDepth(0))
      }
    }
    this.point0 = this.fixedTiles[30 * 15 + 15];
    this.x = Math.floor(window.innerWidth / 2 % 150)
    this.y = Math.floor(window.innerHeight / 2 % 150)

    this.fixedTiles.forEach(x => { x.setScale(this.myScale) })

    //this.hud = new Hud(this);
    addEventListener('clickedNewTile', (x) => {
      const tile = { name: x.detail.name, posx: 375, posy: 375, angle: 0 }
      //new Plate(this,375,375,x.detail.name,-1).setScale(0.5);

      // let plateC = new PlateClass(null,375,375,x.name);
      //console.log(plate, JSON.parse(JSON.stringify(plate)))
      /*fetch('/newPlate/0', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(plate)
      })
        .then(x => x.json())
        .then(x => {
          this.sendMove(x);
        });*/
    })

    addEventListener('draggedTile', (x) => {
      ///console.log('4',x.detail)
      this.sendMove(x.detail);
    })

    addEventListener('rotatedTile', (x) => {
      this.sendMove(x.detail);
    })

    addEventListener("wheel", x => {

//////////////////////////////
//store.dispatch(wsSendMessage({ channel: "/lobby/createGame", payload: { id: "asdasd" } }));
///////////////////////////////


      if (x.deltaY < 0)
        this.myScale += 0.05;
      else
        this.myScale -= 0.05;

      if (this.myScale < 0.2)
        this.myScale = 0.2;

      if (this.myScale > 2)
        this.myScale = 2;

      this.tiles.forEach(x => {
        x.makeScale(this.myScale);
        /*x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
        x.y-= this.origDragPoint.y - this.input.activePointer.position.y;*/
     })
      this.fixedTiles.forEach(x => {
        x.makeScale(this.myScale);
        /*x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
        x.y-= this.origDragPoint.y - this.input.activePointer.position.y;*/
     })
    })

  }

  preload() {
    this.load.image("arrow-back", 'assets/arrow-left.png');
    this.load.atlas('tiles',
      './assets/plates/plates.png',
      './assets/plates/plates.json')
  }

  update() {
    if (this.input.activePointer.isDown) {
      if (this.origDragPoint) {
        
        this.tiles.forEach(x => {
          x.x -= this.origDragPoint.x - this.input.activePointer.position.x;
          x.y -= this.origDragPoint.y - this.input.activePointer.position.y;
        })
        this.fixedTiles.forEach(x => {
          x.x -= this.origDragPoint.x - this.input.activePointer.position.x;
          x.y -= this.origDragPoint.y - this.input.activePointer.position.y;
        })

        this.x -= this.origDragPoint.x - this.input.activePointer.position.x;
        this.y -= this.origDragPoint.y - this.input.activePointer.position.y;
      }

      this.origDragPoint = this.input.activePointer.position.clone();
    }
    else {
      this.origDragPoint = null;
    }
  }
}
