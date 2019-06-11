import 'phaser'

export class Button extends Phaser.GameObjects.Image {

    constructor(scene,x,y,text, callback: () => void){
        super(scene,x,y,"button");

        this.setInteractive();

        //scene.add.text(x, y, text, { fontFamily: 'Calibri, Tahoma, serif' });
        let sign = scene.add.text(x,y, text, { fontFamily: 'Calibri, Tahoma, serif' });
        sign.depth=1;
        sign.setFontSize(40);
        sign.setPosition(x-sign.getBounds().width/2,y-sign.getBounds().height/2)
        
        this.on('pointerdown', (pointer) => {
            sign.setPosition(x-sign.getBounds().width/2,y-sign.getBounds().height/2+5)
            this.setTexture("buttonPressed");
            callback();
        });
        this.on('pointerup', (pointer) => {
            sign.setPosition(x-sign.getBounds().width/2,y-sign.getBounds().height/2)
            this.setTexture("button");
        });

    }


}