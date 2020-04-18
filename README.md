# Chapi-Chapau
Wordgame built with React and Firebase. https://chapi-chapau.firebaseapp.com/
## Screenshots

<p align="center">
  <img height='350px' src="https://github.com/StianIsmar/chapi-chapau-wordgame/blob/master/screenshots/1.png" alt="screenshot" />

  <img height='350px' src="https://github.com/StianIsmar/chapi-chapau-wordgame/blob/master/screenshots/2.png" alt="screenshot" />

  <img height='350px' src="https://github.com/StianIsmar/chapi-chapau-wordgame/blob/master/screenshots/3.png" alt="screenshot" />
</p>


## Libraries used in JS:
 - ReactJS
 - [React Router](https://www.npmjs.com/package/react-router-dom)
 - React Redux with react-promise middleware.

Firebase realtime database is used for storing information about the games and words.
Firebase hosting is used for hosting the webapp.

### react-romoise middleware
When a user creates a new game PIN, the react promise middleware makes sure that the readux state is set before the user is directed to the ```/path``` with react router. This is to make sure the UI is updated with the correct game PIN.

**In src/Actions/Actions.js:**
```javascript
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
```

## Gameplay rules
Create a game PIN to send to your friends or join an existing game.

All players add x amount of words to the database.


Teams of two players then go together. One person tries to descibe the word on the screen and the other person on the same team tries to guess it.

**Round 1:** Describe word with one other word

**Round 2:** Mime word

**Round 3:** Make sound of word
