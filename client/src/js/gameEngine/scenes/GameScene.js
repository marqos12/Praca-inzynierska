import { FixedTile } from "./components/FixedTile";
import store from "../../store";
import { gameWsGameJoined, gameNewTileDisplayed, gameTileInGoodPlace, gameShowTileDetails, gameTileRotated, gameTileRotateRestored } from "../../actions/gameActions.js";
import { Tile } from "./components/Tile.js";
import { getTileSortedEdges, highlightPossiblePlaces, getPossiblePlaces, makeHighlightScale, getTileGeneralType, translateTileName } from "../gameMechanics";
import { TileDetails } from "./components/TileDetails";

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
    this.myScale = window.innerWidth > 1000 ? 0.5 : 0.3;

    this.tileWidth = 300 * this.myScale;
    this.halfOfTable = 23;
    this.tableWidth = this.halfOfTable * 2 + 1;

    this.state = store.getState();
    this.gameConnected = false;

    this.newTile = null;
    this.newTileCard = null;

    this.possiblePlaces = [];
    this.possibleHihglights = [];

    this.tileDetails = null;

    this.initialized = false;

    this.stateChanged = this.stateChanged.bind(this);

    this.unsubscribe = store.subscribe(() => {
      this.state = store.getState();
      if (this.initialized)
        this.stateChanged();
    });

    this.newTileName = "";

    this.plusButton = null;
    this.minusButton = null;
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

    if (window.innerWidth < 700) {
      this.plusButton = new Phaser.GameObjects.Sprite(this, 30, 100, "plusButton");
      this.plusButton.setDepth(900);
      this.plusButton.setScale(0.5);
      this.plusButton.setInteractive();
      this.plusButton.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown()) {
          this.changeScale({ deltaY: -1 })
        }
      });
      this.add.existing(this.plusButton);
      this.minusButton = new Phaser.GameObjects.Sprite(this, 30, 130, "minusButton");
      this.minusButton.setDepth(900);
      this.minusButton.setScale(0.5);
      this.minusButton.setInteractive();
      this.minusButton.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown()) {
          this.changeScale({ deltaY: 1 })
        }
      });
      this.add.existing(this.minusButton);
    }

    this.stateChanged();

    this.events.on('destroy', () => {
      this.unsubscribe();
    })

    addEventListener('draggedTile', (x) => {
      this.newTile.makeScale(this.myScale);
      //this.tiles.push(this.newTile);

      this.newTileCard.destroy();
      this.newTileCard = null;
      this.newTileName.destroy();
      this.newTileName = null;

      this.highlightPossiblePlaces();
    })

    addEventListener('draggingNewTile', (x) => {
      if (this.tileDetails) {
        this.tileDetails.destroy();
        this.tileDetails = null;
      }
    })

    addEventListener('tileInGoodPlace', (x) => {
      store.dispatch(gameTileInGoodPlace({ status: x.detail, tile: this.newTile }));
    })

    addEventListener('showDetails', (x) => {
      if (window.innerWidth >= 700) {
        if (this.tileDetails) this.tileDetails.destroy();
        this.tileDetails = new TileDetails(this, x.detail);
      }
      else {
        store.dispatch(gameShowTileDetails(null))
        store.dispatch(gameShowTileDetails(x.detail))
      }
    })

    addEventListener('updatedTile', (x) => {
      if (this.tileDetails) this.tileDetails.destroy();
      this.tileDetails = new TileDetails(this, x.detail);
    })

    addEventListener('closeTileDetails', (x) => {
      if (this.tileDetails) {
        this.tileDetails.destroy();
        this.tileDetails = null;
      }
    })

    addEventListener("wheel", x => this.changeScale(x))

    this.initialized = true;


    window.addEventListener('resize', () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      if (this.newTileCard) {
        this.newTile.setPosition(
          window.innerWidth - this.newTile.displayWidth * 1.25,
          window.innerHeight - this.newTile.displayWidth * 1.25)
        this.newTileCard.setPosition(this.newTile.x + this.newTile.displayWidth / 2,
          this.newTile.y + this.newTile.displayWidth / 2)
        this.newTileName.setPosition(this.newTile.x, this.newTile.y - 23);

      }
    });
  }

  preload() {

    this.load.image("plusButton", 'assets/plusB.png');
    this.load.image("minusButton", 'assets/minusB.png');
    this.load.image("rotateButton", 'assets/rotate.png');
    this.load.image("rotateBigButton", 'assets/rotateButton.png');
    this.load.image("saveButton", 'assets/saveBtn.png');

    this.load.image("backButton", 'assets/backB.png');
    this.load.image("buldozerButton", 'assets/buldozer.png');
    this.load.image("arrowLeft", 'assets/arrL.png');
    this.load.image("arrowRight", 'assets/arrR.png');
    this.load.image("newTileBackground", 'assets/newTileBackground.png');
    this.load.image("flag", 'assets/flaga.png');
    this.load.image("closeButton", 'assets/closeB.png');
    this.load.image("upgradeButton", 'assets/upgrade.png');
    this.load.image("cancelButton", 'assets/anuluj.png');
    this.load.image("destroyButton", 'assets/zniszcz.png');
    this.load.image("buildButton", 'assets/wybuduj.png');
    this.load.image("tileDetailsBackground", 'assets/tileInfo.png');
    this.load.atlas('tiles',
      './assets/plates/plates.jpg',
      './assets/plates/plates.json')
  }

  update() {
    if (this.input.activePointer.isDown) {
      if (this.origDragPoint) {

        this.tiles.forEach(x => {
          x.x -= this.origDragPoint.x - this.input.activePointer.position.x;
          x.y -= this.origDragPoint.y - this.input.activePointer.position.y;
          if (x.highlight) {
            x.highlight.x = x.x + this.tileWidth / 8;
            x.highlight.y = x.y + this.tileWidth / 8;
          }
          if (x.flash) {
            x.flash.x = x.x;
            x.flash.y = x.y;
          }
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

      if (this.tileDetails) this.tileDetails.move();
    }
    else {
      this.origDragPoint = null;
    }
  }

  stateChanged() {
    console.log("GameScene 235",store, this)
    if (!this.gameConnected && this.state.ws.client && this.state.actualGame.game) {
      this.gameConnected = true;
      store.dispatch(gameWsGameJoined(this.state.actualGame.game));
    }
    if (this.state.actualGame.tilesToDisplay.length != 0) {
      this.state.actualGame.tilesToDisplay.forEach(tile => {
        let tile2 = new Tile(this,
          0,
          0,
          tile.type + "_" + tile.lvl,
          tile.id,
          tile.gamer
        );
        tile2.generalType = tile.generalType;
        tile2.setAngle_My(tile.angle);
        tile2.makeScale(this.myScale);
        tile2.move(tile.posX, tile.posY);
        let oldTile = this.tiles.filter(t => t.id == tile.id);
        console.log("GameScene254",oldTile)
        if (oldTile.length > 0) {
          oldTile[0].destroy2();
          let index = this.tiles.indexOf(oldTile[0]);
          this.tiles.splice(index,1);
        }

        this.tiles.push(tile2);
        this.tiles = this.tiles.filter(t => t.id != tile.id || t.name == tile.type + "_" + tile.lvl);
        this.add.existing(tile2.setDepth(2));
        tile2.highlightNewTile();
        console.log("GameScene 264",this.tiles)
      })
      store.dispatch(gameNewTileDisplayed(this.state.actualGame.game));
      if (this.newTile && !this.newTileCard) {
        this.highlightPossiblePlaces()
      }
    }

    if (this.state.actualGame.myNewTile && !this.newTile) {
      this.dispayMyNewTile();

    } else if (!this.state.actualGame.myNewTile && this.newTile) {


      if (this.newTileCard) {
        this.newTileCard.destroy();
        this.newTileCard = null;
      }
      if (this.newTileName) {
        this.newTileName.destroy();
        this.newTileName = null;
      }

      this.newTile.destroy();
      this.newTile = null;

      this.possiblePlaces = [];

      this.possibleHihglights.forEach(highlight => highlight.destroy())
      this.possibleHihglights = [];
      store.dispatch(gameTileInGoodPlace({ status: false, tile: null }));
    }
    if (this.state.actualGame.rotateTile) {
      let tile = this.tiles.filter(t => t.id == this.state.actualGame.tileDetails.id)
      tile = tile[tile.length - 1]
      tile.rotate();
      store.dispatch(gameTileRotated());
      store.dispatch(gameShowTileDetails(tile))
    }

    if (this.state.actualGame.restoreTileAngle) {
      let tile = this.tiles.filter(t => t.id == this.state.actualGame.tileDetails.id)[0]
      tile.setAngle_My(this.state.actualGame.tileOriginalAngle);
      store.dispatch(gameTileRotateRestored());
    }
  }

  dispayMyNewTile() {
    this.newTile = new Tile(
      this,
      window.innerWidth,
      window.innerHeight,
      this.state.actualGame.myNewTile + "_1",
      -1
    )
    this.newTile.fixed = false;
    this.newTile.generalType = getTileGeneralType(this.state.actualGame.myNewTile);
    this.newTile.makeScale(0.5)
    this.newTile.setPosition(
      window.innerWidth - this.newTile.displayWidth * 1.25,
      window.innerHeight - this.newTile.displayWidth * 1.25)
    this.input.setDraggable(this.newTile)

    this.add.existing(this.newTile.setDepth(101))


    this.newTileCard = new Phaser.GameObjects.Sprite(
      this,
      this.newTile.x + this.newTile.displayWidth / 2,
      this.newTile.y + this.newTile.displayWidth / 2,
      "newTileBackground");
    this.newTileCard.setDisplaySize(
      this.newTile.displayWidth * 1.5,
      this.newTile.displayWidth * 1.5
    );
    this.add.existing(this.newTileCard.setDepth(100))

    let fontConf = { fontFamily: '"Roboto"', fontSize: "16px" };
    this.newTileName = new Phaser.GameObjects.Text(this, this.newTile.x, this.newTile.y - 23, translateTileName(this.state.actualGame.myNewTile + "_1"), fontConf)
    this.newTileName.setDepth(101)
    this.add.existing(this.newTileName);
  }

  highlightPossiblePlaces() {
    this.possibleHihglights.forEach(highlight => highlight.destroy())
    this.possibleHihglights = [];
    this.possiblePlaces = getPossiblePlaces(this.tiles, this.newTile);
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

  changeScale(x) {
    if (x.deltaY < 0)
      this.myScale += 0.05;
    else
      this.myScale -= 0.05;

    if (window.innerWidth >= 700 && this.myScale < 0.2)
      this.myScale = 0.2;
    else if (window.innerWidth < 700 && this.myScale < 0.1)
      this.myScale = 0.1;


    if (window.innerWidth >= 700 && this.myScale > 2)
      this.myScale = 2;
    else if (window.innerWidth < 700 && this.myScale > 0.6)
      this.myScale = 0.6;

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

    if (this.tileDetails) this.tileDetails.move();
  }
}
