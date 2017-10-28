'use strict';

var Init = function (DaBot) {
    DaBot.cmds['help'] = function (to, args, orig) {
        if(args.length < 1)
        {
            DaBot.say(to,  DaBot.help.DaBot, true);
        }
        else if(DaBot.help.hasOwnProperty(args[0]))
        {
            DaBot.say(to, DaBot.help[args[0]], true);
        }
    }
};

module.exports = Init;