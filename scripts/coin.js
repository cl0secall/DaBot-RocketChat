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
        var rnd = Math.floor(Math.random() * (100 - 1)) + 1;
        DaBot.say(to, (rnd %2 === 0) ? 'Heads!' : 'Tails!');
    }
};

module.exports = initCoin;