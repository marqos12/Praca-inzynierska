import { menuReducer } from "./MenuReducer";
import { gameReducer } from "./GameReducer";

const initialState = {
  ws: {
    client: null,
    sessionId: "",
    gameLobbyChannelSybscription: null,
    subscriptions: {}
  },
  auth: {
    loginSuccess: false,
    loginFailed: false,
    user: {},
    token: "",
    registerSuccess: false,
    registerFailed: false
  },
  cookies: null,
  history: null,
  gamesList: [],
  actualGame: {
    game: null,
    gamers: [],
    amIAuthor: false,
    meGamer: null,
    tilesDisplayed:[],
    tilesToDisplay:[],
    myNewTile:null,
    newTileInGoodlPlace:false,
    tileDetails:null,
    rotateTile:false,
    tileOriginalAngle:null,
    restoreTileAngle:false,
    alone:false
  },
  origin: ""
};

function rootReducer(state = initialState, action) {

  state = menuReducer(state,action);

  state = gameReducer(state,action);

  return state;
}

export default rootReducer;