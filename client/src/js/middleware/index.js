import {
    WS_CONNECT_TO_SERVER,
    REGISTER,
    LOGIN,
    WS_GET_GAMES_LIST,
    WS_OPEN_PRIVATE_CANALS,
    WS_SEND_MESSAGE,
    WS_CONNECT_TO_GAME,
    WS_CANNEL_CONNECT,
    WS_CANNEL_DISCONNECT
} from "../constants/action-types";
import { wsConnected, registered, registrationFailed, logged, loginFailed, wsGotGamesList, wsGameCreated, wsGameConnected, wsConnectGame, wsChannelSubscription } from "../actions/index";


export function mainAppMiddleware({ getState, dispatch }) {
    return function (next) {
        return function (action) {

            if (action.type === WS_CONNECT_TO_SERVER) {

                var socket = new SockJS('/gameWS');
                var stompClient = Stomp.over(socket);

                stompClient.connect({}, function (frame) {

                    var url = stompClient.ws._transport.url;
                    url = url.split("/")
                    console.log("Your current session is: " + url[url.length - 2]);
                    let sessionId = url[url.length - 2];

                    //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
                    stompClient.subscribe("/user/" + sessionId + "/reply", function (x) {
                        console.log("ogólny", x);
                    });
                    //nasłuch na kanale prywatnym kiedy sami odpytujemy serwer
                    stompClient.subscribe('/user/queue/reply', x => {

                        let resp = JSON.parse(x.body)

                        console.log("moja zwrotka /middleware/iindex/41 ", resp)
                        switch(resp.type){
                            case "GAME_LIST_UPDATED":
                                dispatch(wsGotGamesList(resp.payload));
                            break;
                            case "GAME_CREATED":
                                dispatch(wsGameCreated(resp.payload))
                                dispatch(wsConnectGame(resp.payload))
                                break;
                            case "ME_GAMER":
                                dispatch(wsConnectGame(resp.payload.game))
                                break;
                        }
                        
                        
                    });
                    return dispatch(wsConnected({ client: stompClient, sessionId: sessionId }))
                });
            }
            if (action.type === WS_OPEN_PRIVATE_CANALS) {
                //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
                let stompClient = getState().ws.client;
                let sessionId = getState().ws.sessionId;
                stompClient.subscribe("/user/" + sessionId + "/reply", function (x) {
                    //const subscription = stompClient.subscribe("/user/queue/msg", function (x) {    	
                    console.log("kierunkowy", x);
                });
                //nasłuch na kanale prywatnym kiedy sami odpytujemy serwer
                stompClient.subscribe('/user/queue/reply', x => {
                    console.log("sami do siebie", x)
                });
            }

            if (action.type === WS_CANNEL_CONNECT) {
                let stompClient = getState().ws.client;
                subscription = stompClient.subscribe(action.payload.channel, action.payload.function);
                dispatch(wsChannelSubscription({ channel: action.payload.channel, function: subscription }))
            }

            if (action.type === WS_CANNEL_DISCONNECT) {
                dispatch(wsChannelSubscription({ channel: action.payload.channel, function: null }))
            }

            if (action.type === WS_SEND_MESSAGE) {
                let stompClient = getState().ws.client;
                stompClient.send("/app" + action.payload.channel, {}, JSON.stringify(action.payload.payload));
            }

            if (action.type === REGISTER) {
                fetch("http://localhost:8080/api/auth/signup", {
                    //fetch("api/auth/signup", {
                    method: 'POST',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(action.payload),
                })
                    .then(response => response.json()).then(response => {
                        return dispatch(registered(response));
                    })
                    .catch(response => {
                        return dispatch(registrationFailed(response));
                    });
            }

            if (action.type === LOGIN) {
                fetch("http://localhost:8080/api/auth/signin", {
                    //fetch("api/auth/signup", {
                    method: 'POST',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(action.payload),
                })
                    .then(response => response.json()).then(response => {

                        if (response.status >= 400)
                            return dispatch(loginFailed(response));
                        else
                            return dispatch(logged(response));
                    })
                    .catch(response => {

                        return dispatch(loginFailed(response));
                    });
            }

            if (action.type === WS_CONNECT_TO_GAME) {
                console.log("middleware 132")
                let stompClient = getState().ws.client;
                let subscription = stompClient.subscribe("/topic/lobby/game/"+action.payload.id, resp =>{
                    resp = JSON.parse(resp.body)
                    console.log("middleware 134",resp)
                });
                dispatch(wsChannelSubscription({ channel:"GAME_LOBBY_CHANNEL", subscription: subscription }))
            }

            return next(action);
        };
    };
}