/* eslint-disable no-console, import/no-extraneous-dependencies */
/**
 * Build a game installer for Windows
 * Justin Purcell
 */
const builder = require('electron-builder');

// Promise is returned
builder.build({
  win: [],
  config: {},
}).then(() => console.log('You saved Sayori!'))
  .catch(e => console.log(`Just Monika: ${e.message}`));
