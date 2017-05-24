'use strict';
const DaBot = require('./app');
const login = require('ddp-login');
var token;

// Keep logic to a minimum in index.js files.
// See https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/
// I know that I didn't follow it to a "T" in this project...
DaBot.connect(function (err, wasReconnect) {
                  if (err)
                  {
                      throw err;
                  }

                  if (wasReconnect)
                  {
                      console.log('Reconnected');
                  }

                  login.loginWithUsername(DaBot, DaBot.config.app.user, DaBot.config.app.pass, function (err, userInfo) {
                      if (err)
                      {
                          console.dir(err);
                      }

                      token = userInfo.token;

                      console.log('LOGGED IN!');
                  });

                  DaBot.onConnect();
              }
);