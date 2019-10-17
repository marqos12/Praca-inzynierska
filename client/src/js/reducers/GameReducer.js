import { GAME_TILE_UPDATE, GAME_NEW_TILE_TO_DISPLAY, GAME_NEW_TILE_DISPLAYED, GAME_MY_NEW_TILE, GAME_MY_NEW_TILE_DISPLAYED, GAME_TILE_IN_GOOD_PLACE, GAME_ME_GAMER_UPDATE } from "../constants/game-action-types";
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

  if (action.type === GAME_MY_NEW_TILE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        myNewTile:action.payload
      })
    });
  }

  if (action.type === GAME_MY_NEW_TILE_DISPLAYED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        myNewTile:null
      })
    });
  }

  if (action.type === GAME_TILE_IN_GOOD_PLACE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        newTileInGoodlPlace:action.payload.status,
        myNewTile:action.payload.tile
      })
    });
  }

  if (action.type === GAME_ME_GAMER_UPDATE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        meGamer: action.payload
      })
    });
  }

  return state;
}