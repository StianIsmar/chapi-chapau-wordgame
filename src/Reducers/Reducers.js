import { SET_GAME_ID } from "../Actions/actions";

const initialState = {
  globalGameId: null,
  globalGameKey: null
};
function gameApp(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case SET_GAME_ID:
      return Object.assign({}, state, {
        globalGameId: action.id,
        globalGameKey: action.globalGameKey
      });
    default:
      return state;
  }

  return state;
}

export default gameApp;
