import {
    WS_CONNECTED_TO_SERVER,
    REGISTERED,
    REGISTRATION_FAILED,
    LOGGED,
    LOGIN_FAILED,
    AUTH_FROM_COOKIES,
    SET_COOKIES_SERVICE,
    WS_GOT_GAMES_LIST,
    SET_HISTORY,
    WS_CANNEL_SUBSCRIPTION,
    WS_GAME_CREATED,
    WS_GAME_UPDATED,
    WS_GAMERS_STATUS_UPDATE,  
    WS_GAME_JOINED,
    WS_GAME_DISCONNECTED,
    LOGOUT,
    SET_ORIGIN
  } from "../constants/action-types";

export function menuReducer(state, action){

  if (action.type === WS_CONNECTED_TO_SERVER) {
    return Object.assign({}, state, {
      ws: { client: action.payload.client, sessionId: action.payload.sessionId }
    });
  }

  if (action.type === REGISTERED) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        registerSuccess: true, registerFailed: false
      })
    });
  }

  if (action.type === REGISTRATION_FAILED) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        registerSuccess: false, registerFailed: true
      })
    });
  }

  if (action.type === LOGGED) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        loginSuccess: true, loginFailed: false, user: action.payload.user, token: action.payload.jwt
      })
    });
  }

  if (action.type === LOGIN_FAILED) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        loginSuccess: false, loginFailed: true, user: {}, token: ""
      })
    });
  }

  if (action.type === LOGOUT) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        loginSuccess: false,
        loginFailed: false,
        user: {},
        token: "",
        registerSuccess: false,
        registerFailed: false
      })
    });
  }

  if (action.type === AUTH_FROM_COOKIES) {
    console.log(AUTH_FROM_COOKIES, state)
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, action.payload)
    });
  }

  if (action.type === SET_COOKIES_SERVICE) {
    return Object.assign({}, state, {
      cookies: action.payload
    });
  }

  if (action.type === SET_HISTORY) {
    return Object.assign({}, state, {
      history: action.payload
    });
  }

  if (action.type == WS_GOT_GAMES_LIST) {
    console.log(action.payload);
    return Object.assign({}, state, {
      gamesList: action.payload
    });
  }

  if (action.type === WS_CANNEL_SUBSCRIPTION) {
    console.log("menuReducer 95", state)
    console.log("menuReducer 96", action.payload)
    console.log("reduced 111", state.ws)
    if (state.ws.subscriptions && state.ws.subscriptions[action.payload.channel]) state.ws.subscriptions[action.payload.channel].unsubscribe();
    return Object.assign({}, state, {
      ws: Object.assign({}, state.ws, {
        subscriptions: Object.assign({}, state.ws.subscriptions, {
          [action.payload.channel]: action.payload.subscription
        })
      })
    });
    
  }

  if (action.type === WS_GAME_CREATED) {
    console.log("menuReducer 107", action.payload)
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        game: action.payload,
        amIAuthor: true
      })
    });
  }

  if (action.type === WS_GAME_UPDATED) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        game: action.payload
      })
    });
  }

  if (action.type === WS_GAMERS_STATUS_UPDATE) {
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        gamers: action.payload
      })
    });
  }

  if (action.type === WS_GAME_JOINED) {
    console.log("menuReducer 145", action.payload.game.author.id == action.payload.user.id)
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        game: action.payload.game,
        meGamer: action.payload,
        amIAuthor: action.payload.game.author.id == action.payload.user.id
      })
    });
  }

  if (action.type === WS_GAME_DISCONNECTED) {
    console.log("menuReducer 151", action.payload)
    return Object.assign({}, state, {
      actualGame: Object.assign({}, state.actualGame, {
        game: null,
        gamers: [],
        amIAuthor: false,
        meGamer: null
      })
    });
  }

  if (action.type === SET_ORIGIN) {
    console.log("menuReducer 187", action.payload)
    return Object.assign({}, state, {
      origin: action.payload
    });
  }
  return state;
}