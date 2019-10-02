import Phaser from "../../phaser/phaser.min.js";

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

        this.setInteractive();
        //scene.input.setDraggable(this)

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            scene.input.activePointer.isDown = false;
            let oldx = gameObject.x;
            let oldy = gameObject.y;
            dragX = Math.floor((gameObject.scene.input.x - gameObject.scene.point0.x + gameObject.displayWidth / 2) / gameObject.displayWidth) * gameObject.displayWidth + gameObject.scene.point0.x - gameObject.displayWidth / 2;
            dragY = Math.floor((gameObject.scene.input.y - gameObject.scene.point0.y + gameObject.displayHeight / 2) / gameObject.displayHeight) * gameObject.displayHeight + gameObject.scene.point0.y - gameObject.displayHeight / 2;
            //dragY = gameObject.scene.input.y - gameObject.scene.y % gameObject.displayHeight;
            oldx = gameObject.x;
            oldy = gameObject.y;
            gameObject.x = dragX;
            gameObject.y = dragY;
            //gameObject.x = Math.floor(dragX / gameObject.displayWidth) * gameObject.displayWidth  + scene.x % gameObject.displayWidth
            //gameObject.y = Math.floor(dragY / gameObject.displayHeight) * gameObject.displayHeight  + scene.y % gameObject.displayHeight;

            //dragX = gameObject.scene.input.x - gameObject.displayWidth / 4 - gameObject.scene.x % gameObject.displayWidth;
            //dragY = gameObject.scene.input.y - gameObject.displayWidth / 4 - gameObject.scene.y % gameObject.displayHeight;

            //dragX = Math.floor(pointer.x / gameObject.displayWidth)*


            /* oldx = gameObject.x;
             oldy = gameObject.y;
             gameObject.x = Math.floor(dragX / gameObject.displayWidth) * gameObject.displayWidth + gameObject.displayWidth / 2 + scene.x % gameObject.displayWidth
             gameObject.y = Math.floor(dragY / gameObject.displayHeight) * gameObject.displayHeight + gameObject.displayHeight / 2 + scene.y % gameObject.displayHeight;*/

            if (gameObject.x != oldx || gameObject.y != oldy) {

                //console.log("koko",this.scene.children.list, this)
                /*for(let i = this.scene.children.list.length; i > 0; i--){
                    console.log("kurwa nie działam :{");
                    if(this.scene.children.list[i]==this)console.log("kurwa działam o.o");
                }*/
                gameObject.dx = oldx - gameObject.x;
                gameObject.dy = oldy - gameObject.y;
                //console.log('6',gameObject)
                let draggedTile = new CustomEvent('draggedTile', { detail: gameObject.getTileObj(gameObject) });
                gameObject.isDragged = true;
                dispatchEvent(draggedTile);
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