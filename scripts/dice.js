'use strict';

var taunts = [
    'Your magical dice have rolled a Unicorn.',
    'Try as might, you have not been able to make a dice out of nothing.',
    'Maybe you should work on counting past 2.',
    'Opps, looks like the Dragon has killed you.',
    'If this was on the streets, you would have been shot before I said this.',
    'Look at the big brain on %%!',
    'Back to Age 1',
    'Smite Me',
    'Release the hounds.',
    'There\'s only two ways this can end.',
    'I have a very bad feeling about this.',
    'You want it sugar coated or between the eyes.',
    'Uh oh, I almost made a booboo.',
    'I will do, what must be done.',
    'Your getting pretty ambitious ain\'t ya?',
    'ORLY!',
    'You made a mistake, well that was entirely unacceptable.',
    'Ooh that\'s gotta hurt.',
    'Buckle up bonehead, cause you\'re going for a ride.',
    'Don\'t make me destroy you.',
    'That\'s impossible, even for a computer.',
    'Watch it buster.',
    'Mother said there\'d be days like this.',
    'I am gravely disappointed in you.',
    'Has it all been, for NOTHING?!',
    'Now that\'s an ass wooping.',
    'Common, quit stalling!',
    'LEROY JENKINS!',
    'That\'s hitting low.',
    'I\'m afraid that\'s something I cannot allow to happen.',
    'I want to play a game.',
    '%% wants a challenge, lets give him one.',
    'I\'ll bash you good',
    'Computers can do that.',
    'We attack under the cover of daylight',
    'I have failed, because you have not helped me.',
    'Very well, if that\'s the way you want to play it.',
    'Never interupt your enemy when he is making a mistake.',
    'I have an announcement, %% is drunk!',
    'There will be blood.',
    'Inconceiveable.',
    'D\'oh!',
    '*cough*',
    'You are making me so angry!',
    'Well isn\'t that special?',
    'Lost Your Mind?',
    'Uh Oh!',
    'Its Peanut Butter Jelly Time!!!',
    'None shall pass.',
    'You wouldnt dare!',
    'I\'ve never been so humiliated in all my life!',
    'Okay have it YOUR way!',
    'You\'re dispicable!',
    'Aint you got nothin better to do?',
    'It will take %% all day to figure this one out.',
    'Houston, we have a problem.',
    'Frankly son, you frighten me.',
    'You\'re mocking me, aren\'t you?',
    'Don\'t even think about it cowboy.',
    'C\'mon, gimmie a break!',
    'Do you feel lucky, punk?',
    'You know, sometimes I feel like you guys don\'t want me to roll dice.',
    'Boy, the potential for something to happen is very high.',
    'My advice to you, start drinking heavily.',
    'Let\'s go, let\'s go, I\'m bored, let\'s go!',
    'That has already happened once, it must never, never happen again.',
    'And monkeys might fly out of my butt!',
    'They\'re always after me lucky charms!',
    'We\'re doomed.',
    'Nice try, but I\'m afraid you can\'t do that.',
    'I will be standing by to assist you if needed.',
    'Oh no, we\'re all doomed!',
    'Not!',
    'Good luck, you\'re gonna need it.',
    'That was a cowards tactic.',
    'That guy\'s coming home in a body bag.',
    'What are we looking at?',
    'That\'s gotta hurt',
    'I\'m gonna hit you so hard, it will make your ancestors dizzy!',
    'I would not do such things if I were you.',
    'You stink!',
    'YOU\'RE A NOOB!\''
];

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
        'Usage: ' + DaBot.config.app.triggerPrefix + 'dice [XdY] - X is the number of dice (up to 120)',
        '       Y is sids per die',
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
                else if(n1 > 0 && n1 < 121 && n2 > 2 && n2 < 121)
                {
                    var r      = roll(n1, n2);
                    var rTotal = r.reduce(function(sum, value)
                                          {
                                              return parseInt(sum) + parseInt(value);
                                          }, 0);

                    var o =  r.join(', ') + ' Total: ' + rTotal;
                    DaBot.say(to, o);
                }
                else if(n1 > 120)
                {
                    DaBot.say(to, 'Who carries over 120 dice with them?!');
                }
                else if(n2 > 120)
                {
                    DaBot.say(to, 'Show me a die with more that 120 faces!!');
                }
                else
                {
                    //console.log(event);
                    DaBot.say(to, taunts[Math.floor(Math.random() * taunts.length)].replace('%%', event.nick));
                }
            }
        }
    }
};

module.exports = initDice;