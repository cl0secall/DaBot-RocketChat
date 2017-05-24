const initExample = function(DaBot)
{
    const name = 'example';
    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'exampe: Example Script');
    DaBot.cmds['test'] = function(to, args, orig)
    {
        /**
        console.log(to);
        console.dir(args);
        console.dir(orig);
        **/
        DaBot.say(to, 'Test Sucessful');
    }
};

module.exports = initExample;