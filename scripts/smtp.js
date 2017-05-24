'use strict';

const nodemailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const initSMTP = function(DaBot)
{
    const name = 'smtp';
    const help = [
        '======================',
        '==     SMTP Help    ==',
        '======================',
        'Usage: ' + DaBot.config.app.triggerPrefix + 'smtp host:{host} [port:{port}] [ssl:(true|false)] user:{user} pass:{password} from:{from} to:{to}'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'smtp: SMTP testing tool.');

    DaBot.help.smtp = help;
    DaBot.cmds.smtp = function (to, args, orig)
    {
        const hostregx   = /host:([^\s]*)/i;
        const portregx   = /port:([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])/i;
        const secureregx = /ssl:(true|false)/i;
        const userregx   = /user:([^\s]*)/i;
        const passregx   = /pass:([^\s]*)/i;
        const fromregx   = /from:([^\s]*)/i;
        const toregx     = /to:([^\s]*)/i;
        var host       = '';
        var port       = '';
        var secure     = '';
        var user       = '';
        var pass       = '';
        var from       = '';
        var sendTo     = '';

        if(args.length > 0)
        {
            args.forEach(function (arg)
                                 {
                                     if(hostregx.exec(arg))
                                     {
                                         host = arg.match(hostregx)[1];
                                         //console.log('HOST = ' + host);
                                     }
                                     else if(portregx.exec(arg))
                                     {
                                         port = arg.match(portregx)[1];
                                     }
                                     else if(secureregx.exec(arg))
                                     {
                                         secure = arg.match(secureregx)[1];
                                     }
                                     else if(userregx.exec(arg))
                                     {
                                         user = arg.match(userregx)[1];
                                     }
                                     else if(passregx.exec(arg))
                                     {
                                         pass = arg.match(passregx)[1];
                                     }
                                     else if(fromregx.exec(arg))
                                     {
                                         from = arg.match(fromregx)[1];
                                     }
                                     else if(toregx.exec(arg))
                                     {
                                         sendTo = arg.match(toregx)[1];
                                     }
                                     else
                                     {
                                         DaBot(to, 'Invalid Option: ' + arg);
                                         return false;
                                     }
                                 });

            if(host && from && sendTo)
            {
                var settings = {
                    host         : host,
                    port         : (port) ? port : 25,
                    secure       : secure,
                    tls          : {
                        rejectUnauthorized: false
                    },
                    name         : 'DaBot',
                    socketTimeout: 20000

                };

                if(user && pass)
                {
                    settings.auth = {
                        user: user,
                        pass: pass
                    };
                }

                var transporter = nodemailer.createTransport(smtpTransport(settings));
                var d           = new Date();
                var dS          = d.getHours() + ':' + d.getMinutes();

                transporter.sendMail({
                                         from   : from,
                                         to     : sendTo,
                                         subject: 'Testing (' + dS + ')',
                                         text   : 'This is a test'
                                     },
                                     function (err, info)
                                     {
                                         //console.log(err || info);

                                         if(err)
                                         {
                                             DaBot.say(to, err);
                                         }
                                         else
                                         {

                                             DaBot.say(to, 'Sent test message to: ' + sendTo);
                                         }
                                     });
            }
            else
            {
                DaBot.say(to, 'Missing Parameters HOST, FROM or TO.');
            }
        }
        else
        {
            DaBot.say(to, 'Missing Parameters.');
        }
    }
};

module.exports = initSMTP;