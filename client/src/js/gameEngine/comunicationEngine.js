

class CommunicationEngine {

    constructor() {
        this.socket = new SockJS('/gameWS');
        this.stompClient = Stomp.over(this.socket);
        this.connected = false;
        this.sessionId = "";

    }

    wsConnect() {
        this.stompClient.connect({}, frame => {

            var url = stompClient.ws._transport.url;
            url = url.split("/")
            this.sessionId = url[url.length - 2];

            //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
            this.stompClient.subscribe("/user/" + sessionId + "/reply", message => {
                console.log("CommunicationEngine 17", message);
            });
            //nasłuch na kanale prywatnym kiedy sami odpytujemy serwer
            this.stompClient.subscribe('/user/queue/reply', message => {

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
        });
    }

    wsJoinGame() {
        //TODO:
        this.stompClient.send("/app" + action.payload.channel, {}, JSON.stringify(action.payload.payload));
    }
    wsSendMovedPlate(plate) {
        //TODO:
        this.stompClient.send("/app" + action.payload.channel, {}, JSON.stringify(action.payload.payload));

    }
}

export default new CommunicationEngine();