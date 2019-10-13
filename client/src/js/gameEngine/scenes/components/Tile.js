import { isThisPositionPossible, isThisPossibleRotation } from "../../gameMechanics";

export class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, id) {
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

        this.influence = null;
        this.generalType = "";

        this.x = x;
        this.y = y;

        this.posX = null;
        this.posY = null;

        this.dummyPosX = null;
        this.dummyPosY = null;

        this.fixed = true;
        this.setInteractive();
        //scene.input.setDraggable(this)

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
                }
            }

            let draggingNewTile = new CustomEvent('draggingNewTile', { detail: this });
            dispatchEvent(draggingNewTile);
        });

        this.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown(0)) {
                if (this.clicked) {
                        scene.input.activePointer.isDown = false;
                    if (!this.fixed) {
                        this.rotate()
                    }
                    else {
                        let draggedTile = new CustomEvent('showDetails', { detail: this });
                        dispatchEvent(draggedTile);
                    }
                }
                else {
                    this.clicked = true;
                    setTimeout(() => { this.clicked = false; }, 500)
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
    }

    update() {

    }

    move(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.x = this.posX * this.displayWidth + this.scene.tableCenterX - this.displayWidth / 2;
        this.y = this.posY * this.displayHeight + this.scene.tableCenterY - this.displayHeight / 2;

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
}