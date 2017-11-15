'use strict';

var answers = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
];

const init8ball = function (DaBot) {
    const name = '8ball';
    const help = [
        '======================',
        '==   Magic 8 Ball   ==',
        '======================',
        DaBot.config.app.triggerPrefix + '8ball: Shake the 8 ball, get answer.'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + '8ball: Shake the 8 ball, get answer.');
    DaBot.help.8ball = help;

    DaBot.cmds['8ball'] = function (to, args, orig) {
        DaBot.say(to, answers[Math.floor(Math.random() * answers.length)]);
    }
};

module.exports = init8ball;