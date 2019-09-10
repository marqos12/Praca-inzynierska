import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import { mainAppMiddleware } from "../middleware";
import createSagaMiddleware from "redux-saga";
import apiSaga from "../sagas/api-saga";

const initialiseSagaMiddleware = createSagaMiddleware();

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    storeEnhancers(
        applyMiddleware(mainAppMiddleware, initialiseSagaMiddleware)
    )
);

initialiseSagaMiddleware.run(apiSaga);
export default store;