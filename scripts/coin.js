'use strict';

const initCoin = function (DaBot) {
    const name = 'coin';
    const help = [
        '===========================',
        '==     Coin     Help     ==',
        '===========================',
        'Flips a coin.',
        DaBot.config.app.triggerPrefix + 'coin'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'coin: Flips a coin.');

    DaBot.help.coin = help;
    DaBot.cmds.coin = function(to, args, orig)
    {
        DaBot.say(to, (Math.random() < 0.5) ? 'Heads!' : 'Tails!');
    }
};

module.exports = initCoin;