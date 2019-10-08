import { FixedTile } from "./components/FixedTile";
import store from "../../store";
import { gameWsGameJoined, gameNewTileDisplayed, gameTileInGoodPlace } from "../../actions/gameActions.js";
import { Tile } from "./components/Tile.js";
import { getTileSortedEdges, highlightPossiblePlaces, getPossiblePlaces, makeHighlightScale } from "../gameMechanics";

export default class GameScene extends Phaser.Scene {

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
    this.newTileCard = null;
    this.newTileCardBorder = null;

    this.possiblePlaces = [];
    this.possibleHihglights = [];

    this.initialized = false;

    this.stateChanged = this.stateChanged.bind(this);

    this.unsubscribe = store.subscribe(() => {
      this.state = store.getState();
      if (this.initialized)
        this.stateChanged();
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
      this.unsubscribe();
    })

    addEventListener('draggedTile', (x) => {
      this.newTile.makeScale(this.myScale);
      this.tiles.push(this.newTile);

      this.newTileCard.destroy();
      this.newTileCard = null;
      this.newTileCardBorder.destroy();
      this.newTileCardBorder = null;

      this.highlightPossiblePlaces();
    })

    addEventListener('tileInGoodPlace', (x) => {
      store.dispatch(gameTileInGoodPlace({ status: x.detail, tile: this.newTile }));
    })


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
      this.possibleHihglights.forEach(x => {
        makeHighlightScale(x, this.myScale)
      })

      if (this.newTile && !this.newTileCard)
        this.newTile.makeScale(this.myScale)

      let oldTileWidth = this.tileWidth;
      this.tileWidth = this.fixedTiles[0].displayWidth


      this.tableCenterX -= window.innerWidth / 2;
      this.tableCenterX = this.tableCenterX / oldTileWidth * this.tileWidth;
      this.tableCenterX += window.innerWidth / 2;

      this.tableCenterY -= window.innerHeight / 2;
      this.tableCenterY = this.tableCenterY / oldTileWidth * this.tileWidth;
      this.tableCenterY += window.innerHeight / 2;
    })

    this.initialized = true;
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
        this.possibleHihglights.forEach(x => {
          x.x -= this.origDragPoint.x - this.input.activePointer.position.x;
          x.y -= this.origDragPoint.y - this.input.activePointer.position.y;
        })

        if (this.newTile && !this.newTileCard) {
          this.newTile.x -= this.origDragPoint.x - this.input.activePointer.position.x;
          this.newTile.y -= this.origDragPoint.y - this.input.activePointer.position.y;
        }

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
          0,
          0,
          tile.type,
          tile.id);
        tile2.setAngle_My(tile.angle);
        tile2.makeScale(this.myScale);
        tile2.move(tile.posX, tile.posY);
        this.tiles.push(tile2);
        this.add.existing(tile2.setDepth(0));
      })
      store.dispatch(gameNewTileDisplayed(this.state.actualGame.game));
    }

    if (this.state.actualGame.myNewTile && !this.newTile) {
      this.newTile = new Tile(
        this,
        window.innerWidth + 400,
        window.innerHeight,
        this.state.actualGame.myNewTile,
        -1
      )
      this.newTile.makeScale(0.5)
      this.newTile.setInteractive()
      this.input.setDraggable(this.newTile)

      this.add.existing(this.newTile.setDepth(1))


      this.newTileCardBorder = new Phaser.GameObjects.Rectangle(
        this,
        window.innerWidth * 0.9 - 2,
        window.innerHeight * 0.85 - 2,
        window.innerWidth * 0.2 + 4,
        window.innerHeight * 0.3 + 4,
        0x41E3FF);
      this.add.existing(this.newTileCardBorder.setDepth(0))

      this.newTileCard = new Phaser.GameObjects.Rectangle(
        this,
        window.innerWidth * 0.9,
        window.innerHeight * 0.85,
        window.innerWidth * 0.2,
        window.innerHeight * 0.3,
        0x5d8FBD,
        0.815);
      this.add.existing(this.newTileCard.setDepth(0))

    } else if (!this.state.actualGame.myNewTile && this.newTile) {
      this.newTile.destroy();
      this.newTile = null;

      this.possiblePlaces = [];

      this.possibleHihglights.forEach(highlight => highlight.destroy())
      this.possibleHihglights = [];
      store.dispatch(gameTileInGoodPlace({ status: false, tile: null }));
    }
  }


  highlightPossiblePlaces() {
    this.possiblePlaces = getPossiblePlaces(this.tiles);
    this.possiblePlaces.forEach(pos => {
      let highlight = new Phaser.GameObjects.Rectangle(
        this,
        pos.posX * this.tileWidth + this.tableCenterX,
        pos.posY * this.tileWidth + this.tableCenterY,
        300, 300,
        0x5d8FBD, 0.815);
      highlight.setScale(this.myScale)
      this.possibleHihglights.push(highlight);
      this.add.existing(highlight)
    })
  }

}
