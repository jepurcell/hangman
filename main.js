/* eslint-disable import/no-extraneous-dependencies */
/**
 * Main process to start the electron app
 * Justin Purcell
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const game = require('./logic.js');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  mainWindow.focus();

  ipcMain.on('game', (e, req) => {
    if (req.start) {
      e.sender.send('start', game.startGame());
    } else if (req.resume) {
      e.sender.send('resume', game.resumeGame());
    } else if (req.guess) {
      e.sender.send('guess', game.guess(req.guess));
    }
  });
});
