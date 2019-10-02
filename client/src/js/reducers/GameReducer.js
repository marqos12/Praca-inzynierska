import { GAME_TILE_UPDATE, GAME_NEW_TILE_TO_DISPLAY, GAME_NEW_TILE_DISPLAYED } from "../constants/game-action-types";
import { wsConnectGame } from "../actions";

export function gameReducer(state, action){
  
  if (action.type === GAME_NEW_TILE_TO_DISPLAY) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        tilesToDisplay: action.payload
      })
    });
  }

  if (action.type === GAME_NEW_TILE_DISPLAYED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        tilesDisplayed:[...state.actualGame.tilesDisplayed, ...state.actualGame.tilesToDisplay],
        tilesToDisplay: []
      })
    });
  }


  return state;
}