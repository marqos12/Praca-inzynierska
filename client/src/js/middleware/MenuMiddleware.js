import {
  WS_CONNECT_TO_SERVER,
  REGISTER,
  LOGIN,
  WS_OPEN_PRIVATE_CANALS,
  WS_SEND_MESSAGE,
  WS_CONNECT_TO_GAME,
  WS_CANNEL_CONNECT,
  WS_GAME_DISCONNECT,
  WS_SUBSCRIBE_GAME_LIST_CHANNEL,
  WS_UNSUBSCRIBE_GAME_LIST_CHANNEL
} from "../constants/action-types";

import {
  wsConnected,
  registered,
  registrationFailed,
  logged,
  loginFailed,
  wsGotGamesList,
  wsGameCreated,
  wsConnectGame,
  wsChannelSubscription,
  wsGamersStatusUpdate,
  wsGameJoined,
  wsSendMessage,
  wsGameDisconnected,
  wsGameUpdated,
} from "../actions/index";
import { gameNewTileToDisplay, gameMyNewTile, gameMeGamerUpdate } from "../actions/gameActions";

export function menuMiddleware(getState, dispatch, action) {

  if (action.type === WS_CONNECT_TO_SERVER) {

    var socket = new SockJS('/gameWS');
    var stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {

      var url = stompClient.ws._transport.url;
      url = url.split("/")
      let sessionId = url[url.length - 2];

      //nasłuch na kanale prywatnym kiedy ktoś nadaje do nas
      stompClient.subscribe("/user/" + sessionId + "/reply", function (x) {
        let resp = JSON.parse(x.body)
        console.log("ogólny", resp);
        switch (resp.type) {
          case "NEW_TILE":
            dispatch(gameMyNewTile(resp.payload))
            break;
            case "ME_GAMER":
              dispatch(gameMeGamerUpdate(resp.payload))
              break;
        }
      });
      //nasłuch na kanale prywatnym kiedy sami odpytujemy serwer
      stompClient.subscribe('/user/queue/reply', x => {

        let resp = JSON.parse(x.body)

        console.log("moja zwrotka menuMiddleware 58 ", resp)
        switch (resp.type) {
          case "GAME_LIST_UPDATED":
            dispatch(wsGotGamesList(resp.payload));
            break;
          case "GAME_CREATED":
            dispatch(wsGameCreated(resp.payload));
            dispatch(wsConnectGame(resp.payload));
            break;
          case "ME_GAMER":
            dispatch(wsGameJoined(resp.payload));
            dispatch(wsConnectGame(resp.payload.game));
            break;
          case "GAME_LEFT":
            dispatch(wsGameDisconnected());
            break;
          case "GAME_JOINED":
            dispatch(gameNewTileToDisplay(resp.payload));
            break;
        }
      });
      return dispatch(wsConnected({ client: stompClient, sessionId: sessionId }))
    });
  }

  if (action.type === WS_CANNEL_CONNECT) {
    let stompClient = getState().ws.client;
    subscription = stompClient.subscribe(action.payload.channel, action.payload.function);
    dispatch(wsChannelSubscription({ channel: action.payload.channel, function: subscription }))
  }

  if (action.type === WS_SEND_MESSAGE) {
    let stompClient = getState().ws.client;
    stompClient.send("/app" + action.payload.channel, {}, JSON.stringify(action.payload.payload));
  }

  if (action.type === REGISTER) {
    fetch(getState().origin + "/api/auth/signup", {
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
    fetch(getState().origin + "/api/auth/signin", {
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
    let stompClient = getState().ws.client;
    let subscription = stompClient.subscribe("/topic/lobby/game/" + action.payload.id, resp => {
      resp = JSON.parse(resp.body)
      console.log("menuMiddleware 134", resp)
      switch (resp.type) {
        case "GAMERS_STATUS_UPDATE":
          dispatch(wsGamersStatusUpdate(resp.payload));
          break;
        case "GAME_UPDATE":
          dispatch(wsGameUpdated(resp.payload));
          break;
        case "GAME_STARTED":
          dispatch(wsGameUpdated(resp.payload));
          break;
      }
    });
    dispatch(wsChannelSubscription({ channel: "GAME_LOBBY_CHANNEL", subscription: subscription }))
  }

  if (action.type === WS_GAME_DISCONNECT) {
    dispatch(wsChannelSubscription({ channel: "GAME_LOBBY_CHANNEL", subscription: null }));
    dispatch(wsSendMessage({
      channel: "/lobby/leaveGame", payload: {
        gamerId: getState().actualGame.meGamer.id
      }
    }));
  }

  if (action.type === WS_SUBSCRIBE_GAME_LIST_CHANNEL) {
    let stompClient = getState().ws.client;
    let subscription = stompClient.subscribe("/topic/lobby/allGames", resp => {
      resp = JSON.parse(resp.body)
      console.log("menuMiddleware 134", resp)
      dispatch(wsGotGamesList(resp));
    });
    dispatch(wsChannelSubscription({ channel: "GAME_LIST_CHANNEL", subscription: subscription }))
  }

  if (action.type === WS_UNSUBSCRIBE_GAME_LIST_CHANNEL) {
    dispatch(wsChannelSubscription({ channel: "GAME_LIST_CHANNEL", subscription: null }));
  }

}