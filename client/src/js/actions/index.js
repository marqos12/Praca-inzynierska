import { ADD_ARTICLE, FOUND_BAD_WORD, WS_CONNECT_TO_SERVER, WS_CONNECTED_TO_SERVER, WS_OPEN_TEST_CANAL, WS_SEND_TEST_MESSAGE } from "../constants/action-types";

export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload };
}

export function foundBadWord(payload) {
    return { type: FOUND_BAD_WORD, payload }
}

export function getData() {
    return { type: "DATA_REQUESTED" };
}

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