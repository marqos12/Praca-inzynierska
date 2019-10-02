import {
    GAME_WS_GAME_JOINED,
    GAME_WS_GAME_DISCONNECT,
    GAME_TILE_UPDATE,
    GAME_NEW_TILE_TO_DISPLAY,
    GAME_NEW_TILE_DISPLAYED,
    GAME_WS_GAME_JOIN
} from "../constants/game-action-types";


export function gameWsGameJoined(payload) {
    return { type: GAME_WS_GAME_JOINED, payload };
}

export function gameWsGameJoin(payload) {
    return { type: GAME_WS_GAME_JOIN, payload };
}

export function gameWsGameDisconnect(payload) {
    return { type: GAME_WS_GAME_DISCONNECT, payload };
}

export function gameTileUpdate(payload) {
    return { type: GAME_TILE_UPDATE, payload };
}

export function gameNewTileToDisplay(payload) {
    return { type: GAME_NEW_TILE_TO_DISPLAY, payload };
}

export function gameNewTileDisplayed(payload) {
    return { type: GAME_NEW_TILE_DISPLAYED, payload };
}