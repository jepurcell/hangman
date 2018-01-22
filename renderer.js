/* global document*/
/**
 * Renderer logic for the hangman web game
 * Justin Purcell
 */
const $ = require('jquery');
const { ipcRenderer } = require('electron')
const imgDiv = document.getElementById('game-img');
const shownSpan = document.getElementById('shown');
const guessedSpan = document.getElementById('guessed');
const gameP = document.getElementById('game-state');
const overallP = document.getElementById('overall-state');
const input = document.getElementById('input');
const btnGuess = document.getElementById('guess-btn');
const btnRestart = document.getElementById('restart-btn');

//send a message when input is submitted
const handleInput = () => {
  if (input.value !== '') {
    ipcRenderer.send('game', { guess: input.value });
  }
}

// handle input on ENTER press or guess button click
btnGuess.onclick = handleInput;

input.onkeyup = (e) => {
  if (e.keyCode === 13) {
    handleInput();
  }
};

//listen for response to input
ipcRenderer.on('guess', (e, data) => {
  // console.log('guess submitted');
  gameP.innerHTML = data.gameText || '';
  input.value = '';
  shownSpan.innerHTML = data.shown || '';
  guessedSpan.innerHTML = (data.guessed) ? data.guessed.join() : '';
  if (data.winFlag || (data.numGuesses && data.numGuesses >= 10)) { // the game has ended
    input.style = 'display: none';
    btnGuess.style = 'display: none';
    btnRestart.style = '';
    btnRestart.focus();
  }
  if (data.winFlag) {
    imgDiv.innerHTML = '<img src="./public/sayori/win.png"></img>';
  } else if (data.numGuesses) { // set the correct image
    imgDiv.innerHTML = `<img src="./public/sayori/hang${data.numGuesses}.png"></img>`;
  }
  if ('gamesPlayed' in data && 'gameWins' in data) {
    overallP.innerHTML = `You have won ${data.gameWins} of ${data.gamesPlayed} games`;
  }
});

//send a message on restart onclick
btnRestart.onclick = () => {
  ipcRenderer.send('game', { start: true });
}

ipcRenderer.on('start', (e, data) => {
  input.style = '';
  input.focus();
  btnGuess.style = '';
  btnRestart.style = 'display: none';
  imgDiv.innerHTML = '';
  shownSpan.innerHTML = data.shown || '';
  guessedSpan.innerHTML = '';
  imgDiv.innerHTML = '<img src="./public/sayori/start.png"></img>';
})

// start or resume the game
// TODO: refactor --  persisting was a late addition
ipcRenderer.on('resume', (e, data) => {
  shownSpan.innerHTML = data.shown || '';
  overallP.innerHTML = `You have won ${data.gameWins} of ${data.gamesPlayed} games`;
  guessedSpan.innerHTML = (data.guessed) ? data.guessed.join() : '';
  if (data.winFlag || (data.numGuesses && data.numGuesses >= 10)) { // the game has ended
    input.style = 'display: none';
    btnGuess.style = 'display: none';
    btnRestart.style = '';
    if (data.winFlag) {
      imgDiv.innerHTML = '<img src="./public/sayori/win.png"></img>';
    } else if (data.numGuesses && data.numGuesses >= 10) {
      imgDiv.innerHTML = '<img src="./public/sayori/hang10.png"></img>';
    }
  } else if (data.numGuesses >= 1) {
    imgDiv.innerHTML = `<img src="./public/sayori/hang${data.numGuesses}.png"></img>`;
  } else {
    imgDiv.innerHTML = '<img src="./public/sayori/start.png"></img>';
  }
});

ipcRenderer.send('game', { resume: true });
