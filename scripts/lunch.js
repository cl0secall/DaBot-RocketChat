'use strict';

const initLunch = function (DaBot) {
    const name = 'lunch';
    const help = [
        '======================',
        '==    Lunch Help    ==',
        '======================',
        'Figure out what you want for lunch.',
        'Usage: ' + DaBot.config.app.triggerPrefix + 'lunch'
    ];

    const picks = [
        'Beer',
        'Quality Burger',
        'Hot Dogs',
        'American Chinese',
        'Real Chinese',
        'Japanese',
        'Fast Food Burger',
        'Thai',
        'Ramen',
        'Vending Machine',
        'Mexican',
        'Tex-Mex',
        'BBQ',
        'Sushi',
        'Indian',
        'Sandwich Shop',
        'Italian',
        'Steak',
        'Meat on a Sword',
        'Sea Food',
        'Bar Food',
        'Soul Food',
        'Cambodian',
        'Caribbean',
        'German',
        'Austrian',
        'Russian',
        'Spanish',
        'French',
        'Vietnamese',
        'Cajun',
        'Moroccan',
        'Laotian',
        'Greek',
        'Mediterranean',
        'Lebanese',
        'American',
        'Korean',
        'Turkish',
        'British',
        'Jewish',
        'Malaysian',
        'Indonesian',
        'Filipino',
        'Polish',
        'American Indian'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'lunch: What is for Lunch?');
    DaBot.help.lunch = help;

    DaBot.cmds['lunch'] = function (to, args, orig) {
        DaBot.say(to, picks[Math.floor(Math.random() * (picks.length - 1))]);
    };
};

module.exports = initLunch;