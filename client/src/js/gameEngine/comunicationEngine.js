

class CommunicationEngine {

    constructor() {
        this.socket = new SockJS('/gameWS');
        this.stompClient = Stomp.over(this.socket);
        this.connected = false;
        this.sessionId = "";
        this.gamer = null;

        this.gameChannelSubscripption = null;
        this.userPrivateChannelSubscripption = null;
        this.userPublicChannelSubscripption = null;
        
    }

    wsConnect(gamer) {
        this.stompClient.connect({}, frame => {

            var url = this.stompClient.ws._transport.url;
            url = url.split("/")
            this.sessionId = url[url.length - 2];

            //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
            this.userPublicChannelSubscripption = this.stompClient.subscribe("/user/" + this.sessionId + "/reply", message => {
                console.log("CommunicationEngine 17", message);
            });
            //nasłuch na kanale prywatnym kiedy sami odpytujemy serwer
            this.userPrivateChannelSubscripption=this.stompClient.subscribe('/user/queue/reply', message => {

                console.log("CommunicationEngine 22 ", message)
                console.log("CommunicationEngine 23 ", message.body)
                let resp = JSON.parse(message.body)

                console.log("CommunicationEngine 26 ", resp)
                switch (resp.type) {
                    /* case "GAME_LIST_UPDATED":
                         dispatch(wsGotGamesList(resp.payload));
                         break;
                     case "GAME_CREATED":
                         dispatch(wsGameCreated(resp.payload))
                         dispatch(wsConnectGame(resp.payload))
                         break;
                     case "ME_GAMER":
                         dispatch(wsGameJoined(resp.payload))
                         dispatch(wsConnectGame(resp.payload.game))
                         break;
                     case "GAME_LEFT":
                         dispatch(wsGameDisconnected())
                         break;*/
                }
            });
            this.connected = true;
            this.wsJoinGame(gamer)
        });
    }

    wsJoinGame(gamer) {
        gamer.sessionId = this.sessionId;
        this.gamer=gamer;
        console.log("communicationEngine 62");
        this.gameChannelSubscripption =this.stompClient.subscribe("/topic/game/game/" + gamer.game.id, message => {
            console.log("CommunicationEngine 60", message);
        });
        this.stompClient.send("/app/game/joinGame", {}, JSON.stringify(gamer));
    }
    wsSendMovedPlate(plate) {
        //TODO:
        this.stompClient.send("/app" + action.payload.channel, {}, JSON.stringify(action.payload.payload));
    }
}

export default new CommunicationEngine();