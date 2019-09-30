import {
    GAME_WS_GAME_JOINED,
    GAME_WS_GAME_DISCONNECT
} from "../constants/game-action-types";


export function gameWsGameJoined(payload) {
    return { type: GAME_WS_GAME_JOINED, payload };
}

export function gameWsGameDisconnect(payload) {
    return { type: GAME_WS_GAME_DISCONNECT, payload };
}