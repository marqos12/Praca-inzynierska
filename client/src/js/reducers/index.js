import { WS_CONNECTED_TO_SERVER, REGISTERED, REGISTRATION_FAILED, LOGGED, LOGIN_FAILED, AUTH_FROM_COOKIES, SET_COOKIES_SERVICE } from "../constants/action-types";

const initialState = {
  ws: {
    client: null,
    sessionId: ""
  },
  auth: {
    loginSuccess:false,
    loginFailed:false,
    user:{},
    token: "",
    registerSuccess:false,
    registerFailed:false
  },
  cookies:null
};

function rootReducer(state = initialState, action) {
  
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
        loginSuccess: true, loginFailed: false, user: action.payload.user , token:action.payload.jwt
     })
    });
  }

  if (action.type === LOGIN_FAILED) {
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, {
        loginSuccess: false, loginFailed: true, user:{},token:""
      })
    });
  }

  if (action.type === AUTH_FROM_COOKIES) {
    console.log(AUTH_FROM_COOKIES,state)
    return Object.assign({}, state, {
      auth: Object.assign({}, state.auth, action.payload)
    });
  }

  if (action.type === SET_COOKIES_SERVICE){
    console.log(SET_COOKIES_SERVICE,state)
    return Object.assign({}, state, {
      cookies: action.payload
    });
  }

  return state;
}

export default rootReducer;