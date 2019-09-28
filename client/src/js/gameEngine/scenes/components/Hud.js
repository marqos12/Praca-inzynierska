import Phaser from "../../phaser/phaser.min.js";
import comunicationEngine from "../../comunicationEngine.js";

export class Hud {

    constructor(scene) {
        this.scene = scene;
        let shoppingCenter = new Phaser.GameObjects.Sprite(scene, 100, 100, 'tiles', 'shoppingCenter')
        let house = new Phaser.GameObjects.Sprite(scene, 200, 100, 'tiles', 'house')
        let church = new Phaser.GameObjects.Sprite(scene, 300, 100, 'tiles', 'church')
        let groceryStore = new Phaser.GameObjects.Sprite(scene, 400, 100, 'tiles', 'groceryStore')
        let roadStraight = new Phaser.GameObjects.Sprite(scene, 500, 100, 'tiles', 'roadStraight')
        let roadExit = new Phaser.GameObjects.Sprite(scene, 600, 100, 'tiles', 'roadExit')
        let roadCross = new Phaser.GameObjects.Sprite(scene, 700, 100, 'tiles', 'roadCross')
        let roadExitDouble = new Phaser.GameObjects.Sprite(scene, 800, 100, 'tiles', 'roadExitDouble')
        let roadCrossDouble = new Phaser.GameObjects.Sprite(scene, 900, 100, 'tiles', 'roadCrossDouble')
        let roadCurve = new Phaser.GameObjects.Sprite(scene, 1000, 100, 'tiles', 'roadCurve')
        let arrowBack = new Phaser.GameObjects.Image(scene, 50, 50, "arrow-back");

        this.comunicationEngine = comunicationEngine

        this.tiles = [];
        /* this.tiles=new Map(
             [['shoppingCenter',shoppingCenter],
             ['house',house],
             ['church',church],
             ['groceryStore',groceryStore],
             ['roadStraight',roadStraight],
             ['roadExit',roadExit],
             ['roadExitDouble',roadExitDouble],
             ['roadCrossDouble',roadCrossDouble],
             ['roadCurve',roadCurve],
             ['roadCross',roadCross],
         ]
         )*/

        this.tiles.push(shoppingCenter);
        this.tiles.push(house);
        this.tiles.push(church);
        this.tiles.push(groceryStore);
        this.tiles.push(roadStraight);
        this.tiles.push(roadExit);
        this.tiles.push(roadExitDouble);
        this.tiles.push(roadCrossDouble);
        this.tiles.push(roadCurve);
        this.tiles.push(roadCross);

        this.tiles.forEach(x => scene.add.existing(x.setOrigin(0).setScale(0.3).setDepth(100)))
        scene.add.existing(arrowBack.setScale(0.5).setDepth(100));

        /////////////////////////////////////////////////////////////////////////
        /*
                console.log(scene);
        
                let background = scene.add.graphics();
                background.fillStyle(0x3795df, 1);
                let x =  (window.innerWidth/2 - 700/2);
                let y =  (window.innerHeight - 200);
                background.fillRoundedRect(x, y, 700, 200, { tl: 20, tr: 20, bl: 0, br: 0 });
                background.setDepth(10000);
                 x =  (window.innerWidth/2 );
                 y =  (window.innerHeight - 100);
                let grid = scene.add.image(x,y, 'bluePrintGrid');
                grid.setDisplaySize(680,180);
                grid.setDepth(10000);*/
        /////////////////////////////////////////////////////////////////////////

        //scene.add.existing(roadCurve.setScale(0.3))

        scene.input.on('pointerdown', (pointer) => {
            this.tiles.forEach((x, y) => {
                //console.log(pointer.x,'>',x.x, '&&', pointer.x,'<',x.x+x.displayWidth," &&", pointer.y, '>', x.y,' &&', pointer.y, '<', x.y ,'+', x.displayHeight)
                if (pointer.x > x.x && pointer.x < x.x + x.displayWidth && pointer.y > x.y && pointer.y < x.y + x.displayHeight) {
                    scene.input.activePointer.isDown = false;
                    let clickedNewTile = new CustomEvent('clickedNewTile', {
                        detail: {
                            name: x.frame.name
                        }
                    });
                    dispatchEvent(clickedNewTile);
                }
            })
            let x = arrowBack;
            let oldx = x.x;
            let oldy = x.y;
            x.x -= arrowBack.displayWidth / 2;
            x.y -= arrowBack.displayHeight / 2
            if (pointer.x > x.x && pointer.x < x.x + x.displayWidth && pointer.y > x.y && pointer.y < x.y + x.displayHeight) {
                document.cookie = "scene" + "=" + "a" + ";  path=/";
                location.reload();
            }
            x.x = oldx;
            x.y = oldy;
        });
    }
}