import {
    WS_CONNECT_TO_SERVER,
    WS_CONNECTED_TO_SERVER,
    REGISTER,
    REGISTERED,
    REGISTRATION_FAILED,
    LOGIN,
    LOGGED,
    LOGIN_FAILED,
    AUTH_FROM_COOKIES,
    SET_COOKIES_SERVICE,
    WS_SEND_MESSAGE,
    WS_GOT_GAMES_LIST,
    WS_OPEN_PRIVATE_CANALS,
    SET_HISTORY,
    WS_CONNECT_TO_GAME,
    WS_GAME_CONNECTED,
    WS_CANNEL_CONNECT,
    WS_CANNEL_DISCONNECT,
    WS_CANNEL_SUBSCRIPTION,
    WS_GAME_CREATED,
    WS_GAME_UPDATED,
    WS_GAMERS_STATUS_UPDATE,
    WS_GAME_JOINED,
    WS_GAME_DISCONNECT,
    WS_GAME_DISCONNECTED,
    LOGOUT,
    WS_SUBSCRIBE_GAME_LIST_CHANNEL,
    WS_UNSUBSCRIBE_GAME_LIST_CHANNEL,
    SET_ORIGIN,
    BEEN_KICKED_OUT,
    WS_ALONE_GAME_CREATED,
    CHAT_GLOBAL_MESSAGE,
    CHAT_GAME_MESSAGE,
} from "../constants/action-types";

export function wsConnect() {
    return { type: WS_CONNECT_TO_SERVER };
}

export function wsConnected(payload) {
    return { type: WS_CONNECTED_TO_SERVER, payload };
}

export function wsOpenPrivateCanals() {
    return { type: WS_OPEN_PRIVATE_CANALS };
}

export function wsSendMessage(payload) {
    return { type: WS_SEND_MESSAGE, payload };
}

export function register(payload) {
    return { type: REGISTER, payload };
}

export function registered(payload) {
    return { type: REGISTERED, payload };
}

export function registrationFailed(payload) {
    return { type: REGISTRATION_FAILED, payload };
}

export function login(payload) {
    return { type: LOGIN, payload };
}

export function logout(payload) {
    return { type: LOGOUT, payload };
}

export function logged(payload) {
    return { type: LOGGED, payload };
}

export function loginFailed(payload) {
    return { type: LOGIN_FAILED, payload };
}

export function setAuthFromCookies(payload) {
    return { type: AUTH_FROM_COOKIES, payload };
}

export function setCookiesService(payload) {
    return { type: SET_COOKIES_SERVICE, payload };
}


export function setHistory(payload) {
    return { type: SET_HISTORY, payload };
}

export function wsGotGamesList(payload) {
    return { type: WS_GOT_GAMES_LIST, payload };
}

export function wsConnectGame(payload) {
    return { type: WS_CONNECT_TO_GAME, payload };
}

export function wsGameConnected(payload) {
    return { type: WS_GAME_CONNECTED, payload };
}


export function wsChannelConnect(payload) {
    return { type: WS_CANNEL_CONNECT, payload };
}

export function wsChannelDisconnect(payload) {
    return { type: WS_CANNEL_DISCONNECT, payload };
}

export function wsChannelSubscription(payload) {
    return { type: WS_CANNEL_SUBSCRIPTION, payload };
}

export function wsGameCreated(payload) {
    return { type: WS_GAME_CREATED, payload };
}

export function wsAloneGameCreated(payload) {
    return { type: WS_ALONE_GAME_CREATED, payload };
}

export function wsGameUpdated(payload) {
    return { type: WS_GAME_UPDATED, payload };
}

export function wsGamersStatusUpdate(payload) {
    return { type: WS_GAMERS_STATUS_UPDATE, payload };
}

export function wsGameJoined(payload) {
    return { type: WS_GAME_JOINED, payload };
}

export function wsGameDisconnect(payload) {
    return { type: WS_GAME_DISCONNECT, payload };
}

export function wsGameDisconnected(payload) {
    return { type: WS_GAME_DISCONNECTED, payload };
}

export function wsSubscribeGameListChannel(payload) {
    return { type: WS_SUBSCRIBE_GAME_LIST_CHANNEL, payload };
}

export function wsUnsubscribeGameListChannel(payload) {
    return { type: WS_UNSUBSCRIBE_GAME_LIST_CHANNEL, payload };
}

export function setOrigin(payload) {
    return { type: SET_ORIGIN, payload };
}

export function beenKickedOut(payload) {
    return { type: BEEN_KICKED_OUT, payload };
}

export function chatGlobalMessage(payload) {
    return { type: CHAT_GLOBAL_MESSAGE, payload };
}

export function chatGameMessage(payload) {
    return { type: CHAT_GAME_MESSAGE, payload };
}