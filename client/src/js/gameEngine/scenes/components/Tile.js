import { isThisPositionPossible } from "../../gameMechanics";

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

        this.x = x;
        this.y = y;

        this.posX = null;
        this.posY = null;

        this.setInteractive();
        //scene.input.setDraggable(this)

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {

            scene.input.activePointer.isDown = false;
            let oldx = gameObject.x;
            let oldy = gameObject.y;

            let posX = Math.floor(
                (
                    gameObject.scene.input.x - gameObject.scene.tableCenterX + gameObject.displayWidth / 2
                ) / gameObject.displayWidth
            );
            
            let posY = Math.floor(
                (
                    gameObject.scene.input.y - gameObject.scene.tableCenterY + gameObject.displayHeight / 2
                ) / gameObject.displayHeight
            )
            if(isThisPositionPossible({posX:posX,posY:posY},gameObject.scene.possiblePlaces)){
                 dragX = posX * gameObject.displayWidth + gameObject.scene.tableCenterX - gameObject.displayWidth / 2;
                 dragY = posY * gameObject.displayHeight + gameObject.scene.tableCenterY - gameObject.displayHeight / 2;
            }
            else {
                dragX = gameObject.scene.input.x - gameObject.displayWidth / 2;
                dragY = gameObject.scene.input.y - gameObject.displayHeight / 2;
            }

            gameObject.x = dragX;
            gameObject.y = dragY;

            if (gameObject.x != oldx || gameObject.y != oldy) {

                gameObject.dx = oldx - gameObject.x;
                gameObject.dy = oldy - gameObject.y;

                if(!gameObject.isDragged){
                    gameObject.isDragged = true;
                    let draggedTile = new CustomEvent('draggedTile', { detail: this});
                    dispatchEvent(draggedTile);
                }
            }

        });

        this.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown(0)) {
                if (this.clicked) {
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
                else {
                    this.clicked = true;
                    setTimeout(() => { this.clicked = false; }, 500)
                }
            }
            if (pointer.rightButtonDown()) {
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
        })
    }

    update() {

    }

    move(dx, dy) {
        if (this.isDragged) {
            this.isDragged = false;
        }
        else {
            this.x -= dx;
            this.y -= dy;
        }
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

    getTileObj(gameObject) {
        return { id: gameObject.id, name: gameObject.name, posx: gameObject.dx, posy: gameObject.dy, angle: gameObject.angle };
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
}