'use strict';

const async = require('async');
const dns   = require('dns');
const whois = require('whois');
const _     = require('lodash');
const http  = require('http');
const reqst = require('request');

const initDNS = function (DaBot) {
    const name = 'dns';
    const help = [
        '======================',
        '==     DNS  Help    ==',
        '======================',
        'Usage: ' + DaBot.config.app.triggerPrefix + 'dns {A|MX|TXT|SRV|PTR|NS|CNAME|WHOIS} {Domain | IP (PTR only)}'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'dns: DNS Tools.');

    DaBot.help.dns = help;
    DaBot.cmds.dns = function (to, args, orig) {
        var ret = [];

        if (args.length > 0)
        {
            args[0] = args[0].toUpperCase();

            if (args.length > 1)
            {
                switch (args[0])
                {
                    case 'A':
                    case 'MX':
                    case 'TXT':
                    case 'SRV':
                    case 'NS':
                    case 'CNAME':
                    case 'WHOIS':
                        if (!DaBot.regexs.domain.test(args[1]))
                        {
                            DaBot.say(to, 'Invalid domain.');
                            return flase;
                        }
                        break;

                    case 'PTR':
                        if (!DaBot.regexs.ipaddr.test(args[1]))
                        {
                            DaBot.say(to, 'Invalid IPv4 Address.');
                            return false;
                        }
                        break;
                    default:
                        DaBot.say(to, help, true);
                        return false;
                }

                switch (args[0])
                {
                    case 'A':
                    case 'MX':
                    case 'TXT':
                    case 'SRV':
                    case 'PTR':
                    case 'NS':
                    case 'CNAME':
                        dns.resolve(args[1], args[0], function (err, result) {
                            if (err)
                            {
                                DaBot.say(to, 'DNS ERROR: ' + err);
                                return false;
                            }

                            switch (args[0])
                            {
                                case 'A':
                                case 'TXT':
                                case 'SRV':
                                case 'PTR':
                                case 'NS':
                                case 'CNAME':
                                    result.forEach(function (item) {
                                        ret.push(item);
                                    });

                                    DaBot.say(to, ret);
                                    break;
                                case 'MX':
                                    result.forEach(function (item) {
                                        ret.push(item.exchange + ':' + item.priority);
                                    });

                                    DaBot.say(to, ret);
                                    break;
                            }
                        });
                        break;
                    case 'WHOIS':
                        var who;

                        whois.lookup(args[1], function (err, whores) {
                            if (err)
                            {
                                who.push(err);
                                return false;
                            }

                            var user = (orig.args[0].hasOwnProperty('u')) ? orig.args[0].u.username : orig.args[0].title;

                            DaBot.say('@' + user, whores);

                        });
                        break;
                }
            }
            else
            {
                DaBot.say(to, help, true);
            }
        }
    }
};

module.exports = initDNS;