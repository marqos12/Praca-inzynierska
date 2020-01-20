import {
  GAME_NEW_TILE_TO_DISPLAY,
  GAME_NEW_TILE_DISPLAYED,
  GAME_MY_NEW_TILE,
  GAME_MY_NEW_TILE_DISPLAYED,
  GAME_TILE_IN_GOOD_PLACE,
  GAME_ME_GAMER_UPDATE,
  SHOW_TILE_DETAILS,
  ROTATE_TILE,
  TILE_ROTATED,
  RESTORE_TILE_ROTATE,
  TILE_ROTATE_RESTORED,
  CLOSE_TUTORIAL,
  TUTORIAL_CLOSED
} from "../constants/game-action-types";

export function gameReducer(state, action) {

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
        tilesDisplayed: [...state.actualGame.tilesDisplayed, ...state.actualGame.tilesToDisplay],
        tilesToDisplay: []
      })
    });
  }

  if (action.type === GAME_MY_NEW_TILE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        myNewTile: action.payload
      })
    });
  }

  if (action.type === GAME_MY_NEW_TILE_DISPLAYED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        myNewTile: null
      })
    });
  }

  if (action.type === GAME_TILE_IN_GOOD_PLACE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        newTileInGoodlPlace: action.payload.status,
        myNewTile: action.payload.tile
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

  if (action.type === SHOW_TILE_DETAILS) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        tileDetails: action.payload,
      })
    });
  }

  if (action.type === ROTATE_TILE) {
    let tileOriginalAngle = state.actualGame.tileOriginalAngle == null ? state.actualGame.tileDetails.angle : state.actualGame.tileOriginalAngle
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        rotateTile: true,
        tileOriginalAngle: tileOriginalAngle
      })
    });
  }

  if (action.type === TILE_ROTATED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        rotateTile: false
      })
    });
  }

  if (action.type === RESTORE_TILE_ROTATE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        restoreTileAngle: true
      })
    });
  }

  if (action.type === TILE_ROTATE_RESTORED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        restoreTileAngle: false,
        tileOriginalAngle: null,
      })
    });
  }

  if (action.type === CLOSE_TUTORIAL) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        closeTutorial: true,
      })
    });
  }

  if (action.type === TUTORIAL_CLOSED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        closeTutorial: false,
      })
    });
  }

  return state;
}