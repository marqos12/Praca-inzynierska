import {  WS_CONNECT_TO_SERVER, WS_CONNECTED_TO_SERVER, WS_OPEN_TEST_CANAL, WS_SEND_TEST_MESSAGE, REGISTER, REGISTERED, REGISTRATION_FAILED, LOGIN, LOGGED, LOGIN_FAILED, AUTH_FROM_COOKIES, SET_COOKIES_SERVICE } from "../constants/action-types";

export function wsConnect() {
    return { type: WS_CONNECT_TO_SERVER };
}

export function wsConnected(payload) {
    return { type: WS_CONNECTED_TO_SERVER, payload };
}

export function wsOpenTestCanal() {
    return { type: WS_OPEN_TEST_CANAL };
}

export function wsSendTestMessage(payload) {
    return { type: WS_SEND_TEST_MESSAGE, payload };
}

export function register(payload){
    return { type: REGISTER, payload };
}

export function registered(payload){
    return { type: REGISTERED, payload };
}

export function registrationFailed(payload){
    return { type: REGISTRATION_FAILED, payload };
}

export function login(payload){
    return { type: LOGIN, payload };
}

export function logged(payload){
    return { type: LOGGED, payload };
}

export function loginFailed(payload){
    return { type: LOGIN_FAILED, payload };
}

export function setAuthFromCookies(payload){
    return { type: AUTH_FROM_COOKIES, payload };
}

export function setCookiesService(payload){
    return { type: SET_COOKIES_SERVICE, payload };
}