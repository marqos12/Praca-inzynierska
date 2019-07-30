import { ADD_ARTICLE, WS_CONNECT_TO_SERVER, WS_OPEN_TEST_CANAL, WS_SEND_TEST_MESSAGE } from "../constants/action-types";
import { foundBadWord, wsConnected } from "../actions/index";



const forbiddenWords = ["spam", "money"];
export function forbiddenWordsMiddleware({ getState, dispatch }) {
    return function (next) {
        return function (action) {
            // do your stuff
            if (action.type === ADD_ARTICLE) {

                const foundWord = forbiddenWords.filter(word =>
                    action.payload.title.includes(word)
                );
                if (foundWord.length) {
                    return dispatch(foundBadWord(word));
                }
            }
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


            return next(action);
        };
    };
}