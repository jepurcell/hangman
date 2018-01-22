/* global describe it beforeEach */
const game = require('../logic.js');
const { expect } = require('chai');

describe('server-logic', () => {
  describe('startGame', () => {
    it('should return a default state object', () => {
      const gameState = game.startGame();
      expect(gameState.gameWins).to.equal(0);
      expect(gameState.gamesPlayed).to.equal(0);
      expect(gameState.numGuesses).to.equal(0);
      expect(gameState.shown).to.be.a('string');
      expect(gameState.gameText).to.equal('Type a letter in the box and press the button to guess.');
      expect(gameState.winFlag).to.equal(false);
      expect(gameState.guessed).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('getState', () => {
    it('should return the current state', () => {
      game.startGame(); // prepare by starting a new game
      const gameState = game.getState();
      expect(gameState.gameWins).to.equal(0);
      expect(gameState.gamesPlayed).to.equal(0);
      expect(gameState.numGuesses).to.equal(0);
      expect(gameState.shown).to.be.a('string');
      expect(gameState.gameText).to.equal('Type a letter in the box and press the button to guess.');
      expect(gameState.winFlag).to.equal(false);
      expect(gameState.guessed).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('startGame', () => {
    it('should return a default state object', () => {
      const gameState = game.startGame();
      expect(gameState.gameWins).to.equal(0);
      expect(gameState.gamesPlayed).to.equal(0);
      expect(gameState.numGuesses).to.equal(0);
      expect(gameState.shown).to.be.a('string');
      expect(gameState.gameText).to.equal('Type a letter in the box and press the button to guess.');
      expect(gameState.winFlag).to.equal(false);
      expect(gameState.guessed).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('guess', () => {
    beforeEach(() => {
      game.startGame();
    });
    it('should advance the game when a new letter is guessed', () => {
      const newState = game.guess('a');
      expect(newState.numGuesses).to.be.oneOf([0, 1]);
      if (newState.numGuesses === 0) {
        expect(newState.shown).to.contain('a');
        expect(newState.gameText).to.equal('Correct.');
      } else {
        expect(newState.gameText).to.equal('That is incorrect.');
      }
    });
    it('should not advance the game when a non-alpha character is guessed', () => {
      const newState = game.guess('4');
      expect(newState.numGuesses).to.equal(0);
      expect(newState.gameText).to.equal('Please guess a letter of the English alphabet.');
    });
    it('should not advance the game when a repeat character is guessed', () => {
      const newState = game.guess('a');
      const newestState = game.guess('a');
      expect(newestState.numGuesses).to.equal(newState.numGuesses);
      expect(newestState.gameText).to.equal('Please guess a new letter.');
    });
    it('should not advance the game when multiple characters guessed', () => {
      const newState = game.guess('aa');
      expect(newState.numGuesses).to.equal(0);
      expect(newState.gameText).to.equal('Please guess a single letter.');
    });
  });

  describe('resumeGame', () => {
    it('should resume the game if one exists', () => {
      const gameState = game.startGame();
      const newState = game.guess('a');
      expect(newState).not.to.deep.equal(gameState);
      const newestState = game.resumeGame();
      expect(newestState).to.deep.equal(newState);
    });
  });
});
