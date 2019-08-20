import { WS_CONNECT_TO_SERVER, WS_OPEN_TEST_CANAL, WS_SEND_TEST_MESSAGE, REGISTER, LOGIN } from "../constants/action-types";
import { wsConnected, registered, registrationFailed, logged, loginFailed } from "../actions/index";


export function mainAppMiddleware({ getState, dispatch }) {
    return function (next) {
        return function (action) {
            
            if (action.type === WS_CONNECT_TO_SERVER) {

                var socket = new SockJS('/greeting');
                var stompClient = Stomp.over(socket);

                stompClient.connect({}, function (frame) {

                    var url = stompClient.ws._transport.url;
                    url = url.split("/")
                    console.log("Your current session is: " + url[url.length - 2]);
                    let sessionId = url[url.length - 2];
                    return dispatch(wsConnected({ client: stompClient, sessionId: sessionId }))

                });
            }
            if (action.type === WS_OPEN_TEST_CANAL) {
                //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
                let stompClient = getState().ws.client;
                let sessionId = getState().ws.sessionId;
                const subscription = stompClient.subscribe("/user/" + sessionId + "/reply", function (x) {
                    //const subscription = stompClient.subscribe("/user/queue/msg", function (x) {    	
                    console.log(x);
                });
            }

            if (action.type === WS_SEND_TEST_MESSAGE) {
                //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
                let stompClient = getState().ws.client;
                var chatMessage = {
                    to: action.payload.targetSessionId,
                    from: getState().ws.sessionId,
                    text: 'Hello, WORLD!!!!'
                };
                stompClient.send("/app/message3", {}, JSON.stringify(chatMessage));
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



            return next(action);
        };
    };
}