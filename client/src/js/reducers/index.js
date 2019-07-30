import { ADD_ARTICLE, FOUND_BAD_WORD, WS_CONNECTED_TO_SERVER } from "../constants/action-types";

const initialState = {
  articles: [],
  foundBadWords: '',
  remoteArticles: [],
  ws: {
    client: null,
    sessionId: ""
  }
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload),
      foundBadWords: ''
    });
  }
  else if (action.type === FOUND_BAD_WORD) {
    return Object.assign({}, state, {
      foundBadWords: action.payload
    });
  }

  if (action.type === "DATA_LOADED") {
    return Object.assign({}, state, {
      remoteArticles: state.remoteArticles.concat(action.payload)
    });
  }

  if (action.type === WS_CONNECTED_TO_SERVER) {
    return Object.assign({}, state, {
      ws: { client: action.payload.client, sessionId: action.payload.sessionId }
    });
  }
  return state;
}

export default rootReducer;