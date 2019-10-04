import { Scene } from "../phaser/phaser.min.js";
import Phaser from "../phaser/phaser.min.js";
import { FixedTile } from "./components/FixedTile";
import store from "../../store";
import { gameWsGameJoined, gameNewTileDisplayed } from "../../actions/gameActions.js";
import { Tile } from "./components/Tile.js";

export default class GameScene extends Scene {

  constructor() {
    super({
      key: "GameScene"
    });

    this.fixedTiles = [];
    this.tiles = [];
    this.origDragPoint;
    this.tableCenterX = 0;
    this.tableCenterY = 0;
    this.myScale = 0.5;

    this.tileWidth = 150;
    this.halfOfTable = 15;
    this.tableWidth = this.halfOfTable * 2 + 1;

    this.state = store.getState();
    this.gameConnected = false;

    this.newTile = null;

    console.log("GameScene 26", this.state)
    this.unsubscribe = store.subscribe(() => {
      console.log("GameScene 47", this.state)
      this.state = store.getState();
    });


  }

  create() {
    for (let i = 0; i < this.tableWidth; i++) {
      for (let j = 0; j < this.tableWidth; j++) {
        let tile = new FixedTile(this,
          (i - this.halfOfTable) * this.tileWidth + Math.floor(window.innerWidth / 2),
          (j - this.halfOfTable) * this.tileWidth + Math.floor(window.innerHeight / 2),
          'green' + Phaser.Math.Between(1, 2));

        tile.setAngle(Phaser.Math.Between(0, 3) * 90)
        this.fixedTiles.push(tile);
        this.add.existing(tile.setDepth(0))
      }
    }



    this.tableCenterX = Math.floor(window.innerWidth / 2)
    this.tableCenterY = Math.floor(window.innerHeight / 2)
    this.fixedTiles.forEach(x => { x.setScale(this.myScale) })
    this.tileWidth = this.fixedTiles[0].displayWidth

    this.stateChanged();
    this.events.on('destroy', () => {
      console.log("GameScene 67")
      this.unsubscribe();
    })
    
    addEventListener('draggedTile', (x) => {
      this.newTile.makeScale(this.myScale);
      this.tiles.push(this.newTile);
    })
/*
    addEventListener('rotatedTile', (x) => {
      this.sendMove(x.detail);
    })
    */

    addEventListener("wheel", x => {
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
      })
      this.fixedTiles.forEach(x => {
        x.makeScale(this.myScale);
      })
      this.tileWidth = this.fixedTiles[0].displayWidth
      console.log("GameScene 82", this.tileWidth)
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

        this.tableCenterX -= this.origDragPoint.x - this.input.activePointer.position.x;
        this.tableCenterY -= this.origDragPoint.y - this.input.activePointer.position.y;
      }

      this.origDragPoint = this.input.activePointer.position.clone();
    }
    else {
      this.origDragPoint = null;
    }
  }

  stateChanged() {
    if (!this.gameConnected && this.state.ws.client && this.state.actualGame.game) {
      this.gameConnected = true;
      store.dispatch(gameWsGameJoined(this.state.actualGame.game));
    }
    if (this.state.actualGame.tilesToDisplay.length != 0) {
      this.state.actualGame.tilesToDisplay.forEach(tile => {
        let tile2 = new Tile(this,
          this.tableCenterX + tile.posX * this.tileWidth - 150,
          this.tableCenterY + tile.posY * this.tileWidth - 150,
          tile.type,
          tile.id);
        tile2.makeScale(this.myScale);
        tile2.setAngle(tile.angle);
        this.tiles.push(tile2);
        this.add.existing(tile2.setDepth(0))
      })
      store.dispatch(gameNewTileDisplayed(this.state.actualGame.game));
    }

    if (this.state.actualGame.myNewTile && !this.newTile) {
      this.newTile = new Tile(
        this,
        window.innerWidth+400,
        window.innerHeight,
        this.state.actualGame.myNewTile,
        -1
      )
      this.newTile.makeScale(0.5)
      this.input.setDraggable(this.newTile)
      console.log("GameScene 160", this.newTile)
      this.add.existing(this.newTile.setDepth(1))
    }

  }


}
