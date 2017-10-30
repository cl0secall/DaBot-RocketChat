'use strict';

function initApp(DaBot)
{
    DaBot.cmds = {};

    DaBot.regexs = {
        nonAlphaNum: /([\x01-\x2f]|[\x3a-\x40]|[\x5B-\x60]|[\x7B-\xFF])/g,
        domain: /\b((?=[a-zA-Z0-9-]{1,63}\.)(xn--)?[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}\b/,
        ipaddr: /^(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])\.((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){2}(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])$/,
        netcidr: /^(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])\.((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){2}(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
        network: /^(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])\.((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){2}(25[0-4]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
        netmask: /^255\.((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){2}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
        netlogic: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/
    };

    /**
     * Simplify the sendMessage.
     *
     * @param to
     * @param message
     * @param preformat - makes the output "pre formated"
     */
    DaBot.say = function (to, message, preformat) {
        var chanMatch = to.match(/^#(.*)/);
        var userMatch = to.match(/^@(.*)/);

        if (message.isArray || message instanceof Array)
        {
            message = message.join("\n");
        }

        if (preformat)
        {
            message = "```\n" + message + "\n```";
        }

        if (chanMatch)
        {
            DaBot.call('channelsList', [chanMatch[1], 'Public'], function (err, data) {
                if (err)
                {
                    throw err;
                }

                if (data.channels.length === 1)
                {
                    DaBot.call('sendMessage', [{
                                   _id: DaBot.Random.id(),
                                   rid: data.channels[0]._id,
                                   msg: message
                               }],
                               function (err) {
                                   if (err)
                                   {
                                       throw err;
                                   }
                               });

                }
                else if (data.channels.length > 1)
                {
                    console.log('Dabot.say(): More than on channel matches:');
                    console.dir(data.channels);
                }
                else
                {
                    console.log('Dabot.say(): NO CHANNEL MATCHES');
                }
            });
        }
        else if (userMatch)
        {
            DaBot.call('createDirectMessage', [userMatch[1]], function (err, data) {
                if (err)
                {
                    console.dir(err);
                }

                DaBot.call('sendMessage', [{
                               _id: DaBot.Random.id(),
                               rid: data.rid,
                               msg: message
                           }],
                           function (err) {
                               if (err)
                               {
                                   console.dir(err);
                                   console.log(data.rid);
                                   console.log(message);
                               }
                           });
            })
        }
        else
        {
            DaBot.call('sendMessage', [{
                           _id: DaBot.Random.id(),
                           rid: to,
                           msg: message
                       }],
                       function (err) {
                           if (err)
                           {
                               console.dir(err);
                               console.log(to);
                               console.log(message);
                           }
                       });
        }
    };

    /**
     * Simplify the joinRoom call.
     * DaBot.joinRoom('#general');
     * DaBot.joinRoom(rid);
     *
     * @param room
     */
    DaBot.joinRoom = function (room) {
        var chanMatch = room.match(/^#(.*)/);

        if (chanMatch)
        {
            DaBot.call('channelsList', [chanMatch[1], 'Public'], function (err, data) {
                if (err)
                {
                    throw err;
                }

                if (data.channels.length === 1)
                {

                    // Join the Room
                    DaBot.call('joinRoom', [data.channels[0]._id], function (err) {
                        if (err)
                        {
                            console.log('Could not join ' + room);
                            console.dir(err);
                        }
                        else
                        {
                            // Subscribe to the messages
                            DaBot.subscribe('stream-room-messages',
                                            [data.channels[0]._id],
                                            function (err) {
                                                if (err)
                                                {
                                                    console.log('Could not subscribe to ' + room);
                                                    console.dir(err);
                                                }
                                            });
                        }
                    });
                }
                else if (data.channels.length > 1)
                {
                    console.log('Dabot.say(): More than on channel matches:');
                    console.dir(data.channels);
                }
                else
                {
                    console.log('Dabot.say(): NO CHANNEL MATCHES');
                }
            });
        }
        else
        {
            DaBot.call('joinRoom', [room], function (err) {
                if (err)
                {
                    console.log('Could not join ' + room);
                    console.dir(err);
                    return false;
                }
                else
                {
                    DaBot.subscribe('stream-room-messages',
                                    [room],
                                    function (err) {
                                        if (err)
                                        {
                                            console.log('Could not subscribe to ' + room);
                                            console.dir(err);
                                        }
                                    });
                }
            });
        }
    };

    /**
     * Load in script
     *
     * @param script
     */
    DaBot.load = function (script) {

        try
        {
            require('../scripts/' + script)(DaBot);
        } catch (e)
        {
            console.dir(e);
        }
    };

    // Load the scripts
    DaBot.config.app.scripts.forEach(function (script) {
        DaBot.load(script);
    });

    DaBot.onConnect = function () {
        console.log('CONNECTED!');

        /**
         * Subscribe to Room(s)
         */
        DaBot.config.app.rooms.forEach(function(room)
                                       {
                                           DaBot.joinRoom(room);
                                       });
    };

    DaBot.on('message', function (msg) {
        msg = JSON.parse(msg);

        if(msg.msg === 'added' && msg.collection === 'users')
        {
            // Listen to DMs
            DaBot.subscribe('stream-notify-user', [msg.id + '/notification'], function (err) {
                if (err)
                {
                    throw err;
                }
            });
        }
        if (msg.hasOwnProperty('fields'))
        {
            //console.dir(msg.fields.args);
        }

        var cmd;
        var args;
        var patt = new RegExp('^' + DaBot.config.app.triggerPrefix + "(\\w+)\\s?(.*)?", 'im');
        var match;

        // Channel Messages
        if (msg.msg === 'changed' && msg.collection === 'stream-room-messages')
        {
            // Do look at our own messsages!
            if (msg.fields.args[0].u.username !== DaBot.config.app.user)
            {
                // Lets look for our trigger!
                if (DaBot.config.app.triggerPrefixe === msg.fields.args[0].msg.charAt(0))
                {
                    args = msg.fields.args[0].msg.split(' ');
                    cmd  = args.shift();

                    if (args.length > 0)
                    {
                        args = args.map(function (str) {
                            return str.trim();
                        });
                    }

                    cmd = cmd.toLowerCase().substr(1);
                }

                if (DaBot.cmds.hasOwnProperty(cmd))
                {
                    DaBot.cmds[cmd](msg.fields.eventName, args, msg.fields);
                }
            }
        }
        else if (msg.msg === 'changed' && msg.collection === 'stream-notify-user')
        {
            // DMs
             // Lets look for our trigger!
            if (DaBot.config.app.triggerPrefixes.indexOf(msg.fields.args[0].text.charAt(0)) > -1)
            {

                args = msg.fields.args[0].text.split(' ');
                cmd  = args.shift();

                if (args.length > 0)
                {
                    args = args.map(function (str) {
                        return str.trim();
                    });
                }

                cmd = cmd.toLowerCase().substr(1);

                if (DaBot.cmds.hasOwnProperty(cmd))
                {
                    DaBot.cmds[cmd](msg.fields.args[0].title, args, msg.fields);
                }
            }
        }
    });
}

module.exports = initApp;