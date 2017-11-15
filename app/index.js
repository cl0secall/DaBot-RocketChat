'use strict';
const config    = require('../config');
const DDPClient = require('ddp');
const login     = require('ddp-login');
var token       = null;
var DaBot       = new DDPClient({
                                    // All properties optional, defaults shown
                                    host: config.app.host,
                                    port: config.app.port,
                                    ssl: config.app.ssl,
                                    autoReconnect: config.app.autoReconnect,
                                    autoReconnectTimer: config.app.autoReconnectTimer,
                                    maintainCollections: config.app.maintainCollections,
                                    ddpVersion: config.app.ddpVersion,
                                    useSockJs: config.app.useSockJs,
                                    url: config.app.url
                                });
DaBot.Random    = require('ddp-random');
DaBot.config    = config;
DaBot.help      = {
    DaBot: [
        '==================',
        '=   DaBot Help   =',
        '==================',
        DaBot.config.app.triggerPrefix + 'help: Shows this.',
        DaBot.config.app.triggerPrefix + 'help {command}: Shows the help for {command}'
    ]
};

// Keeping as much logic out of the index.js files as possible
require('./init.js')(DaBot);

module.exports = DaBot;