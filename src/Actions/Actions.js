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