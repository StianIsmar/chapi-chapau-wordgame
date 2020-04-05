import { SET_GAME_ID } from "./Actions/Actions";

const initialState = {
  globalGameId: null
};
function gameApp(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case SET_GAME_ID:
      return Object.assign({}, state, {
        globalGameId: action.id
      });
    default:
      return state;
  }

  return state;
}
