import "phaser";
import {Button} from './gameObjects/button';
import { GameScene } from "./gameScene";

export class MenuScene extends Phaser.Scene {

    
        lastScene = "a";
    constructor() {
        super({
            key: "MenuScene"
        });
        

        document.cookie.split("; ").forEach(cookie => {
            let cookie2 = cookie.split("=");
            if(cookie2[0]=="scene")this.lastScene = cookie2[1];
        });
    }

    preload(): void {
       
        this.load.image('menuBackground', 'assets/wawa.jpg');
        this.load.image('menuBackground2', 'assets/menuBackground.png');
        this.load.image('bluePrintGrid', 'assets/blue-grid-background.jpg');
        this.load.image('button', 'assets/menuButton.png');
        this.load.image('buttonPressed', 'assets/menuButtonPressed.png');
        this.load.image('title', 'assets/title.png');
        if(this.lastScene!="a")this.scene.start(this.lastScene);
      }

      create() {
        let menuImage = this.add.image(window.innerWidth/2,window.innerHeight/2,"menuBackground");
        menuImage.setScale(window.innerWidth/menuImage.getBounds().width);
        let menuBackground = this.add.image(window.innerWidth/2,450,"menuBackground2");
        let button1 = new Button(this,window.innerWidth/2,300,"Zaloguj Się",()=>{this.scene.start('LoginScene');
        document.cookie ="scene"+"="+"LoginScene"+";  path=/";});
        this.add.existing(button1);
        let button2= new Button(this,window.innerWidth/2,400,"Zarejestruj",()=>{});
        this.add.existing(button2);
        let button3 = new Button(this,window.innerWidth/2,500,"O grze",()=>{});
        this.add.existing(button3);
        this.add.image(window.innerWidth/2,130,"title");
    
    }
}