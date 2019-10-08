import {
    GAME_WS_GAME_DISCONNECT,
    GAME_WS_GAME_JOIN
} from "../constants/game-action-types";
import {
    wsChannelSubscription,
    wsSendMessage
} from "../actions";
import { gameMyNewTile, gameNewTileToDisplay } from "../actions/gameActions";

export function GameMiddleware(getState, dispatch, action) {

    if (action.type === GAME_WS_GAME_JOIN) {
        console.log("gameMiddleware 13")
        let stompClient = getState().ws.client;
        let subscription = stompClient.subscribe("/topic/game/game/" + action.payload.id, resp => {
            resp = JSON.parse(resp.body)
            console.log("gameMiddleware 17", resp)
            switch (resp.type) {
                case "NEW_TILE":
                        dispatch(gameNewTileToDisplay(resp.payload));
                    break;
            }
        });
        console.log("gameMiddleware 24", subscription)
        dispatch(wsChannelSubscription({ channel: "GAME_GAME_CHANNEL", subscription: subscription }))

        dispatch(wsSendMessage({
            channel: "/game/joinGame", payload:
                getState().actualGame.meGamer

        }));
    }

    if (action.type === GAME_WS_GAME_DISCONNECT) {
        console.log("gameMiddleware 29")
        dispatch(wsChannelSubscription({ channel: "GAME_GAME_CHANNEL", subscription: null }));
    }
}