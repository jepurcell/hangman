/**
 * Game logic for the hangman web game
 * Justin Purcell
 */
const randomWords = require('random-words');

// "public" variables -- sent to the client
let gameWins = 0;
let gamesPlayed = 0;
let numGuesses;
let shown;
let gameText;
let winFlag;
let guessed;

// "private" variables -- used for updating game state
let answer;

/**
 * check whether the input was a correct guess
 * @param string guess
 */
const parseInput = (input) => {
  if (input.length !== 1) { // the guess was not one character
    gameText = 'Please guess a single letter.';
  } else if (/[a-zA-z]/.exec(input[0])) { // the guess was a letter
    const letter = input[0].toLowerCase();
    if (guessed.includes(letter)) { // this is a repeated guess
      gameText = 'Please guess a new letter.';
    } else if (answer.split('').includes(letter)) { // the guess is correct
      guessed = guessed.concat(letter);
      // Add a 'thin' whitespace character for readability on the client
      shown = shown.split(' ').map((cur, index) => (
        (answer.split('')[index] === letter) ? letter : cur
      )).join(' ');
      if (!/[_]/.exec(shown)) { // the user has won
        gamesPlayed += 1;
        gameWins += 1;
        gameText = 'You win! Would you like to play again?';
        winFlag = true;
      } else { // the user has not yet won
        gameText = 'Correct.';
      }
    } else { // the guess is incorrect
      guessed = guessed.concat(letter);
      gameText = 'That is incorrect.';
      numGuesses += 1;
    }
  } else { // the guess was not a letter
    gameText = 'Please guess a letter of the English alphabet.';
  }
  if (numGuesses >= 10) { // end the game if the guesses are used up
    gameText = 'You lose. Would you like to try again?';
    shown = answer.split('').join(' ');
    gamesPlayed += 1;
  }
};

/**
 * @return game state object
 */
const getState = () => ({
  gameWins,
  gamesPlayed,
  numGuesses,
  shown,
  gameText,
  winFlag,
  guessed,
});

/**
* start game and create object to return to client
* @return game state object
*/
const startGame = () => {
  gameText = 'Type a letter in the box and press the button to guess.';
  numGuesses = 0;
  guessed = [];
  winFlag = false;
  answer = randomWords();
  console.log(`the answer is: ${answer}`);
  shown = '_'.repeat(answer.length).split('').join(' ');
  return getState();
};

module.exports = {

  // TODO consider adding setState for more comprehensive unit testing
  startGame,
  getState,

  /**
   * resume the game if one exists, otherwise start a new game
   * @return game state object
   */
  resumeGame: () => {
    if (numGuesses || gamesPlayed || (shown && /[a-z]/.exec(shown))) {
      // console.log('resuming');
      return getState();
    }
    return startGame();
  },

  /**
  * perform logic on the game state given a guess
  * @param string guess
  * @return game state object
  */
  guess: (input) => {
    parseInput(input);
    return getState();
  },
};
