import { menuMiddleware } from "./MenuMiddleware";
import { GameMiddleware } from "./GameMiddleware";

export function mainAppMiddleware({ getState, dispatch }) {
    return function (next) {
        return function (action) {

            menuMiddleware(getState, dispatch, action);
            GameMiddleware(getState, dispatch, action);

            return next(action);
        };
    };
}