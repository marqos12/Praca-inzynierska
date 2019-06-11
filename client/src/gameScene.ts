import "phaser";
import {FixedPlate} from "./gameObjects/fixedPlates";
import {Hud} from "./gameObjects/hud";
import {Plate} from "./gameObjects/plate";

import { Client, Message } from '@stomp/stompjs';

export class GameScene extends Phaser.Scene {

    fixedPlates:FixedPlate[]=[];
    hud:Hud;
    plates:Plate[]=[];
    origDragPoint;
    x=0;
    y=0;
    stompClient;
    socket;
    myScale=0.5;
    point0;
    id;
    login;


    constructor() {
        super({
            key: "GameScene"
        });
    }

  init(/*params: any*/): void {

  }

  preload(): void {
        document.cookie.split("; ").forEach(cookie => {
            let cookie2 = cookie.split("=");
            if(cookie2[0]=="id")this.id = cookie2[1];
            if(cookie2[0]=="login")this.login = cookie2[1];
        });
        this.load.image("arrow-back",'assets/arrow-left.png');
    this.load.atlas('plates',
    './assets/plates/plates.png',
    './assets/plates/plates.json')
    //this.load.image('bluePrintGrid', 'assets/blue-grid-background.jpg');
  }
  create() {

    for(let i = 0; i < 30; i++){
        for(let j = 0; j < 30; j++){
            let plate = new FixedPlate(this,(i*150)-15*150 + Math.floor(window.innerWidth/2/150)*150,j*150-15*150 + Math.floor(window.innerHeight/2/150)*150,'green'+Phaser.Math.Between(1, 2))
            plate.setAngle(Phaser.Math.Between(0, 3)*90)
            this.fixedPlates.push(plate);
            this.add.existing(plate.setDepth(0))        
        }   
    }
    this.point0 = this.fixedPlates[30*15+15];
    this.x =  Math.floor(window.innerWidth/2%150)
    this.y =  Math.floor(window.innerHeight/2%150)
 
    this.fixedPlates.forEach(x=>{x.setScale(this.myScale)})
   
    this.hud = new Hud(this);
    addEventListener('clickedNewPlate',(x:CustomEvent)=>{
        const plate = {name:x.detail.name, posx:375,posy:375,angle:0}
        //new Plate(this,375,375,x.detail.name,-1).setScale(0.5);

       // let plateC = new PlateClass(null,375,375,x.name);
        //console.log(plate, JSON.parse(JSON.stringify(plate)))
        fetch('/newPlate/0',{
            method:"POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(plate)})
            .then(x=>x.json())
            .then(x=>{
                this.sendMove(x);
                
            });
    })

    addEventListener('draggedPlate',(x:CustomEvent)=>{
      ///console.log('4',x.detail)
      
       this.sendMove(x.detail);
    })

    addEventListener('rotatedPlate',(x:CustomEvent)=>{
        this.sendMove(x.detail);
    })

    addEventListener("wheel", x=>{
        if(x.deltaY < 0)
            this.myScale-=0.05;
        else 
        this.myScale +=0.05;

        if(this.myScale<0.2)
            this.myScale=0.2;

        if(this.myScale>2)
            this.myScale=2;



        this.plates.forEach(x=>{
            x.makeScale(this.myScale);
            /*x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
            x.y-= this.origDragPoint.y - this.input.activePointer.position.y;*/
        })
        this.fixedPlates.forEach(x=>{
            x.makeScale(this.myScale);
            /*x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
            x.y-= this.origDragPoint.y - this.input.activePointer.position.y;*/

        })
        
    })



    this.connect();


}



update() {

    if (this.input.activePointer.isDown) {	
        if (this.origDragPoint) {
        
            this.plates.forEach(x=>{
                x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
                x.y-= this.origDragPoint.y - this.input.activePointer.position.y;
            })
            this.fixedPlates.forEach(x=>{
                x.x-= this.origDragPoint.x - this.input.activePointer.position.x;
                x.y-= this.origDragPoint.y - this.input.activePointer.position.y;
            })


            this.x-= this.origDragPoint.x - this.input.activePointer.position.x;
            this.y-= this.origDragPoint.y - this.input.activePointer.position.y;
        }

        this.origDragPoint = this.input.activePointer.position.clone();
    }
    else {	
        this.origDragPoint = null;
    }

   
}

connect() {

    this.stompClient = new Client({
        brokerURL: "ws://"+window.location.href.split('//')[1]+"game-websocket",
        
        debug: function (str) {
          //console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });
      
      this.stompClient.activate();
      this.stompClient.onConnect =(frame) =>{
        // Do something, all subscribes must be done is this callback
        // This is needed because this will be executed after a (re)connect
    
      this.stompClient.subscribe("/topic/game/"+this.id, x=>{
           // console.log('2',x.body)
            x=JSON.parse(x.body)
            let existingPlate = this.plates.filter(oldPlate=>oldPlate.id == x.id);

            if(existingPlate.length>0) {
                
                existingPlate[0].move(x.posx,x.posy);
                existingPlate[0].setAngle_My(x.angle);
            }
            else {
                let newPlate = new Plate(this,x.posx,x.posy,x.name,x.id).setScale(this.myScale);
                this.plates.push(newPlate);
                this.add.existing(newPlate.setDepth(10));
            }

         
         
          //this.plates.push(plate2);
          //console.log('3',plate2);
          ///this.add.existing(plate2);
        });
      };
      
      this.stompClient.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      };
      

//this.socket= socketIo('/game-websocket');
//https://stomp-js.github.io/guide/stompjs/rx-stomp/ng2-stompjs/2018/06/28/pollyfils-for-stompjs-v5.html
//this.stompClient = Stomp.over('/game-websocket');
//this.stompClient.debug = null;
/*this.stompClient.connect({}, connection => {
    this.stompClient.subscribe('/topic/game/1', message=> {
        let plate = JSON.parse(message.body);
        console.log(plate)
        let existingPlate = this.plates.filter(oldPlate=>oldPlate.id == plate.id);

        if(existingPlate.length>0) {console.log("e",existingPlate[0])}
        else {
            let newPlate = new Plate(this,plate.posx,plate.posy,plate.name, plate.id).setScale(0.5);
            
            this.plates.push(newPlate);
            console.log(this.plates);
            this.add.existing(newPlate.setDepth(10));
        }


    });
});*/
}

disconnect() {
/*if (this.stompClient !== null) {
    this.stompClient.disconnect();*/
    this.stompClient.deactivate();
}
setConnected(){
console.log("Disconnected");
}

sendMove(plate) {    
//this.stompClient.send("/app/game/1", {},JSON.stringify(plate));

this.stompClient.publish({destination: '/app/game/'+this.id, body: JSON.stringify(plate)});

}

};