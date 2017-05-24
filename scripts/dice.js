'use strict';

// Random generator
function clamp(num, min, max)
{
    return Math.min(Math.max(num, min), max);
}

function roll(dice, faces)
{
    var i;
    var results = [];

    dice  = clamp(dice, 1, faces);
    faces = clamp(faces, 1, faces);

    for (i = 0; i < dice; i++)
    {
        results.push((Math.floor(Math.random() * faces) + 1).toString(10));
    }

    return results;
}

const initDice = function(DaBot)
{
    const name = 'dice';
    const help = [
        '======================',
        '==    Dice  Help    ==',
        '======================',
        'Rolls some dice.',
        'Usage: ' + DaBot.config.app.triggerPrefix + 'dice [XdY] - X is the number of dice (up to 20)',
        '       Y is sids per die (up to 10000)',
        '       ' + DaBot.config.app.triggerPrefix + 'dice - rolls 1 6-sided die',
        '       ' + DaBot.config.app.triggerPrefix + 'dice 2d20 - rolls 2 20 sided dice'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'dice: Roll some dice.');

    DaBot.help.dice = help;
    DaBot.cmds.dice = function(to, args, orig) {
        if (args.length < 1)
        {
            DaBot.say(to, roll(1, 6));
        }
        else
        {
            var params = args[0].toLowerCase();
            params     = params.split('d');
            if (params.length !== 2)
            {
                DaBot.say(to, help, true);
            }
            else
            {
                var n1 = parseInt(params[0].trim());
                var n2 = parseInt(params[1].trim());

                if (isNaN(n1) || isNaN(n2))
                {
                    DaBot.say(to, help, true);
                }
                else
                {
                    DaBot.say(to, roll(n1, n2).join(', '));
                }
            }
        }
    }
};

module.exports = initDice;