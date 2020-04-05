/*
 * action types, could have in seperate file
 */

export const SET_GAME_ID = "SET_GAME_ID";

/*
 * action creators
 */

export function setGameId(id, key) {
  return { type: SET_GAME_ID, id, key };
}

export function setGameId1(id, key) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: "SET_GAME_ID",
        id,
        key
      });
      resolve();
    });
  };
}

export const updateState = (id, key) =>
  Promise.resolve({
    type: "SET_GAME_ID",
    id,
    key
  });
