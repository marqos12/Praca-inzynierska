import "phaser";
import {Button} from './gameObjects/button';
import { GameScene } from "./gameScene";

export class LoginScene extends Phaser.Scene {

    constructor() {
        super({
            key: "LoginScene"
        });
        
    }

    preload(): void {
        
        this.load.image('menuBackground3', 'assets/wawa.jpg');
        this.load.image('menuBackground4', 'assets/menuBackground.png');
        this.load.image('title2', 'assets/title.png');
      }

      create() {
        let menuImage = this.add.image(window.innerWidth/2,window.innerHeight/2,"menuBackground3");
        menuImage.setScale(window.innerWidth/menuImage.getBounds().width);
        let menuBackground = this.add.image(window.innerWidth/2,window.innerHeight/2,"menuBackground4");

        let contentDiv = document.getElementById("content");
        contentDiv.innerHTML="<div class='login'><div class='field'><div class='control'><input class='input is-info' id='id' type='text' placeholder='Id'></div></div>"
        contentDiv.innerHTML+="<div class='field'><div class='control'><input class='input is-info' id='login'  type='text' placeholder='Login'></div></div>";
        contentDiv.innerHTML+="<div class='field'><a id='accept' class='button is-info is-rounded'>Przejdź dalej</a></div></div>";

        $("#accept").on('click', ()=>{
            if($('#login').val()!="")
            {
                document.cookie ="login"+"="+$('#login').val()+";  path=/";
                document.cookie ="id"+"="+$('#id').val()+";  path=/";
                document.cookie ="scene"+"="+"GameScene"+";  path=/";
                console.log(document.cookie);
                contentDiv.innerHTML="";
                this.scene.start('GameScene');
            }            
        });
        /*let button1 = new Button(this,window.innerWidth/2,window.innerHeight/2-200,"Zaloguj Się",()=>{this.scene.start('GameScene');
        document.cookie ="scene"+"="+"GameScene"+";  path=/";});
        this.add.existing(button1);
        let button2= new Button(this,window.innerWidth/2,window.innerHeight/2-100,"Zarejestruj",()=>{});
        this.add.existing(button2);
        let button3 = new Button(this,window.innerWidth/2,window.innerHeight/2,"O grze",()=>{});
        this.add.existing(button3);*/
        
    
        this.add.image(window.innerWidth/2,130,"title2");
    
    }
}