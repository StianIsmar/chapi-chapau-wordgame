import { SET_GAME_ID } from "../Actions/Actions";

const initialState = {
  globalGameId: 0,
  globalGameKey: 0,
};
function gameApp(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case SET_GAME_ID:
      return Object.assign({}, state, {
        globalGameId: action.id,
        globalGameKey: action.key,
      });
    default:
      return state;
  }

  return state;
}

export default gameApp;
