import { isThisPositionPossible, isThisPossibleRotation } from "../../gameMechanics";

export class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, id, owner) {
        super(scene, x, y, 'tiles', texture)
        this.setOrigin(0, 0);
        this.name = texture;
        this.id = id;
        this.scene = scene;
        this.dx = 0;
        this.dy = 0;
        this.isDragged = false;
        this.clicked = false;
        this.inGoodPlace = false;
        this.owner = owner;
        this.influence = null;
        this.generalType = "";
        this.scene = scene;

        this.x = x;
        this.y = y;

        this.posX = null;
        this.posY = null;

        this.dummyPosX = null;
        this.dummyPosY = null;

        this.fixed = true;
        this.setInteractive();
        //scene.input.setDraggable(this)
        this.flash = null;
        this.flashInterval = null;

        this.highlightNewTileAfterDrag = null;

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {

            scene.input.activePointer.isDown = false;
            let oldx = gameObject.x;
            let oldy = gameObject.y;

            this.dummyPosX = Math.floor(
                (
                    gameObject.scene.input.x - gameObject.scene.tableCenterX + gameObject.displayWidth / 2
                ) / gameObject.displayWidth
            );

            this.dummyPosY = Math.floor(
                (
                    gameObject.scene.input.y - gameObject.scene.tableCenterY + gameObject.displayHeight / 2
                ) / gameObject.displayHeight
            )
            if (isThisPositionPossible({ posX: this.dummyPosX, posY: this.dummyPosY }, gameObject.scene.possiblePlaces)) {
                dragX = this.dummyPosX * gameObject.displayWidth + gameObject.scene.tableCenterX - gameObject.displayWidth / 2;
                dragY = this.dummyPosY * gameObject.displayHeight + gameObject.scene.tableCenterY - gameObject.displayHeight / 2;

                if (!this.inGoodPlace) {
                    this.inGoodPlace = true;

                    let tileInGoodPlace = new CustomEvent('tileInGoodPlace', { detail: true });
                    let tile = gameObject.scene.newTile
                    for (let i = 0; i < 4; i++) {
                        if (isThisPossibleRotation(tile, gameObject.scene.tiles, gameObject.dummyPosX, gameObject.dummyPosY))
                            break;
                        else tile.rotate()
                    }
                    dispatchEvent(tileInGoodPlace);

                }
            }
            else {
                dragX = gameObject.scene.input.x - gameObject.displayWidth / 2;
                dragY = gameObject.scene.input.y - gameObject.displayHeight / 2;


                if (this.inGoodPlace) {
                    this.inGoodPlace = false;
                    let tileInGoodPlace = new CustomEvent('tileInGoodPlace', { detail: false });
                    dispatchEvent(tileInGoodPlace);
                }
            }

            gameObject.x = dragX;
            gameObject.y = dragY;

            if (gameObject.x != oldx || gameObject.y != oldy) {

                gameObject.dx = oldx - gameObject.x;
                gameObject.dy = oldy - gameObject.y;

                if (!gameObject.isDragged) {
                    gameObject.isDragged = true;
                    let draggedTile = new CustomEvent('draggedTile', { detail: this });
                    dispatchEvent(draggedTile);
                   // this.showHighlightAfterDrag();
                }
                if (gameObject.highlightNewTileAfterDrag)
                gameObject.highlightNewTileAfterDrag.setPosition(gameObject.x - gameObject.displayWidth * 0.1, gameObject.y - gameObject.displayWidth * 0.1);
                else 
                gameObject.showHighlightAfterDrag();
                
            }

            let draggingNewTile = new CustomEvent('draggingNewTile', { detail: this });
            dispatchEvent(draggingNewTile);
        });

        this.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                if (!scene.state.actualGame.tileDetails || pointer.position.y < (window.innerHeight - 300)) {

                    if (this.clicked) {
                        scene.input.activePointer.isDown = false;
                        if (!this.fixed) {
                            this.rotate()
                            for (let i = 0; i < 4; i++) {
                                if (isThisPossibleRotation(this, this.scene.tiles, this.dummyPosX, this.dummyPosY))
                                    break;
                                else this.rotate()
                            }
                        }
                        else {
                            let draggedTile = new CustomEvent('showDetails', { detail: this });
                            dispatchEvent(draggedTile);

                        }
                    }
                    else {
                        setTimeout(() => {
                            setTimeout(() => { this.clicked = false; }, 500)
                            this.clicked = true;
                            //this.clicked = false; 
                        }, 50)
                    }
                }
            }
            if (pointer.rightButtonDown()) {
                if (!this.fixed) {
                    this.rotate()

                    for (let i = 0; i < 4; i++) {
                        if (isThisPossibleRotation(this, this.scene.tiles, this.dummyPosX, this.dummyPosY))
                            break;
                        else this.rotate()
                    }
                }

            }

        })

        this.highlight = null;
        if (owner && scene.state.actualGame.meGamer.id == owner.id) {
            this.highlight = new Phaser.GameObjects.Sprite(this.scene, this.x + this.displayWidth / 8, this.y + this.displayWidth / 8, "flag")
            this.scene.add.existing(this.highlight.setDepth(3))

        }
    }

    update() {
    }

    destroy2() {
        if (this.highlight) this.highlight.destroy();
        this.highlightNewTileAfterDrag.destroy()
        this.destroy();
    }

    move(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.x = this.posX * this.displayWidth + this.scene.tableCenterX - this.displayWidth / 2;
        this.y = this.posY * this.displayHeight + this.scene.tableCenterY - this.displayHeight / 2;
        if (this.highlight)
            this.highlight.setPosition(this.x + this.displayWidth / 8, this.y + this.displayWidth / 8)
        if (this.flash)
            this.flash.setPosition(this.x, this.y)
        if (this.highlightNewTileAfterDrag)
            this.highlightNewTileAfterDrag.setPosition(this.x - this.displayWidth * 0.1, this.y - this.displayWidth * 0.1);

    }

    setAngle_My(angle) {
        this.angle = angle;
        if (this.angle == 0)
            this.setOrigin(0, 0);
        if (this.angle == 90)
            this.setOrigin(0, 1);
        if (this.angle == -180)
            this.setOrigin(1, 1);
        if (this.angle == -90)
            this.setOrigin(1, 0);
    }

    getTileObj() {
        return { type: this.name.slice(0, -2), posX: this.dummyPosX, posY: this.dummyPosY, angle: this.angle };
    }

    getTileMove() {
        return { id: this.id, name: this.name, posx: this.dx, posy: this.dy };
    }

    makeScale(scale) {
        let oldWidth = this.displayWidth;
        this.setScale(scale);
        let newWidth = this.displayWidth;
        this.x -= window.innerWidth / 2;
        this.x = this.x / oldWidth * newWidth;
        this.x += window.innerWidth / 2;
        this.y -= window.innerHeight / 2;
        this.y = this.y / oldWidth * newWidth;
        this.y += window.innerHeight / 2;
        if (this.highlight) {
            this.highlight.setDisplaySize(this.displayWidth / 8, this.displayWidth / 4);
            this.highlight.setPosition(this.x + this.displayWidth / 8, this.y + this.displayWidth / 8)
        }
        if (this.flash) {
            this.flash.setDisplaySize(this.displayWidth, this.displayWidth);
            this.flash.setPosition(this.x, this.y)
        }
        if (this.highlightNewTileAfterDrag) {
            this.highlightNewTileAfterDrag.setDisplaySize(this.displayWidth * 1.2, this.displayWidth * 1.2);
            this.highlightNewTileAfterDrag.setPosition(this.x - this.displayWidth * 0.1, this.y - this.displayWidth * 0.1);
        }

    }

    rotate() {
        this.angle += 90;
        if (this.angle == 0)
            this.setOrigin(0, 0);
        if (this.angle == 90)
            this.setOrigin(0, 1);
        if (this.angle == -180)
            this.setOrigin(1, 1);
        if (this.angle == -90)
            this.setOrigin(1, 0);
        this.dx = 0;
        this.dy = 0;
        let rotatedTile = new CustomEvent('rotatedTile', { detail: this.getTileObj(this) });
        dispatchEvent(rotatedTile);
    }

    highlightNewTile() {
        this.flash = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.displayWidth, this.displayHeight, 0xf0f000, 0.4)
        this.flash.setOrigin(0, 0);
        this.flash.setDepth(11);
        this.flash.setPosition(this.x, this.y);
        this.scene.add.existing(this.flash)
        this.flashInterval = setInterval(() => {
            clearInterval(this.flashInterval);
            this.flash.destroy();
            this.flash = null;
        }, 2000)
    }

    showHighlightAfterDrag() {
        //this.highlightNewTileAfterDrag = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.displayWidth * 1.2, this.displayHeight * 1.2, 0xfcffe2, 0.7)
        this.highlightNewTileAfterDrag = new Phaser.GameObjects.Sprite(this.scene, this.x , this.y , "tileHighlight")
        this.highlightNewTileAfterDrag.setOrigin(0, 0);
        this.highlightNewTileAfterDrag.setDepth(100);
        this.highlightNewTileAfterDrag.setDisplaySize(this.displayWidth*1.2,this.displayWidth*1.2)
        this.highlightNewTileAfterDrag.setPosition(this.x - this.displayWidth * 0.1, this.y - this.displayWidth * 0.1);
        this.scene.add.existing(this.highlightNewTileAfterDrag)
    }
}