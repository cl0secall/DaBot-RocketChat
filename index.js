'use strict';
// Log stuff
var util    = require('util');
var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)(
    {
        filename: './logs/log',
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        handleExceptions: true,
        exitOnError: false,
        level: 'debug'
    });

var logger = new (winston.Logger)(
    {
        transports: [
            transport
        ]
    });

function formatArgs(args)
{
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function(){
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function(){
    logger.debug.apply(logger, formatArgs(arguments));
};

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