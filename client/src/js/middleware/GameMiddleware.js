import {
    GAME_WS_GAME_DISCONNECT,
    GAME_WS_GAME_JOIN,
    GAME_UPDATE_TILE
} from "../constants/game-action-types";
import {
    wsChannelSubscription,
    wsSendMessage
} from "../actions";
import { gameNewTileToDisplay } from "../actions/gameActions";

export function GameMiddleware(getState, dispatch, action) {

    if (action.type === GAME_WS_GAME_JOIN) {
        let stompClient = getState().ws.client;
        let subscription = stompClient.subscribe("/topic/game/game/" + action.payload.id, resp => {
            resp = JSON.parse(resp.body)
            switch (resp.type) {
                case "NEW_TILE":
                    dispatch(gameNewTileToDisplay(resp.payload));
                    break;
            }
        });
        dispatch(wsChannelSubscription({ channel: "GAME_GAME_CHANNEL", subscription: subscription }))

        dispatch(wsSendMessage({
            channel: "/game/joinGame", payload:
                getState().actualGame.meGamer
        }));
    }

    if (action.type === GAME_UPDATE_TILE) {
        dispatch(wsSendMessage({
            channel: "/game/updateTile", payload:
                action.payload
        }));
    }

    if (action.type === GAME_WS_GAME_DISCONNECT) {
        dispatch(wsChannelSubscription({ channel: "GAME_GAME_CHANNEL", subscription: null }));
    }
}