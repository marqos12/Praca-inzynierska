import {
    GAME_WS_GAME_JOINED,
    GAME_WS_GAME_DISCONNECT,
    GAME_TILE_UPDATE,
    GAME_NEW_TILE_TO_DISPLAY,
    GAME_NEW_TILE_DISPLAYED,
    GAME_WS_GAME_JOIN,
    GAME_MY_NEW_TILE,
    GAME_MY_NEW_TILE_DISPLAYED,
    GAME_TILE_IN_GOOD_PLACE,
    GAME_SEND_NEW_TILE_POSITION,
    GAME_ME_GAMER_UPDATE,
    GAME_UPDATE_TILE,
    SHOW_TILE_DETAILS,
    ROTATE_TILE,
    TILE_ROTATED,
    RESTORE_TILE_ROTATE,
    TILE_ROTATE_RESTORED
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

export function gameMyNewTile(payload) {
    return { type: GAME_MY_NEW_TILE, payload };
}

export function gameMyNewTileDisplayed(payload) {
    return { type: GAME_MY_NEW_TILE_DISPLAYED, payload };
}

export function gameTileInGoodPlace(payload) {
    return { type: GAME_TILE_IN_GOOD_PLACE, payload };
}

export function gameMeGamerUpdate(payload) {
    return { type: GAME_ME_GAMER_UPDATE, payload };
}

export function gameUpdateTile(payload) {
    return { type: GAME_UPDATE_TILE, payload };
}

export function gameShowTileDetails(payload) {
    return { type: SHOW_TILE_DETAILS, payload };
}

export function gameRotateTile(payload) {
    return { type: ROTATE_TILE, payload };
}

export function gameTileRotated(payload) {
    return { type: TILE_ROTATED, payload };
}

export function gameRestoreTileRotate(payload) {
    return { type: RESTORE_TILE_ROTATE, payload };
}

export function gameTileRotateRestored(payload) {
    return { type: TILE_ROTATE_RESTORED, payload };
}