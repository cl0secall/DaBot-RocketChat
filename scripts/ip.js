'use strict';

const ip          = require('ip');
const Ping        = require('ping-lite');
const Traceroute  = require('traceroute-lite');
const portChecker = require('portchecker');
const whois       = require('whois-ux');
const S           = require('string');

const initIP = function (DaBot) {
    const name = 'ip';
    const help = [
        '======================',
        '==     IP   Help    ==',
        '======================',
        '!ping: Ping a Host',
        'Usage:',
        '!ip ping 8.8.8.8',
        '!ip ping google.com',
        '----------------------',
        '!trace: Traceroute to a Host',
        'Usage:',
        '!ip trace 8.8.8.8',
        '!ip trace google.com',
        '----------------------',
        '!port: See if port is open',
        'Usage:',
        '!ip port 8.8.8.8 51',
        '!ip port google.com 51',
        '----------------------',
        '!calc: Get netblock information',
        'Usage:',
        '!ip calc 192.168.0.1/24',
        '!ip calc 192.168.0.1 255.255.255.0',
        '----------------------',
        '!not: Convert to inverse mask',
        'Usage:',
        '!ip not 0.0.0.255',
        '----------------------',
        '!whois: Get owner of an IP address',
        'Usage:',
        '!ip whois 8.8.8.8',
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'ip: IPv4 Tools.');

    DaBot.help.ip = help;
    DaBot.cmds.ip = function (to, args, orig) {
        if (args.length > 1)
        {
            var cmd = args.shift().toLowerCase();

            if (cmd !== 'not' && cmd !== 'calc' && cmd !== 'whois')
            {
                if (!DaBot.regexs.domain.exec(args[0]) && !DaBot.regexs.ipaddr.exec(args[0]))
                {
                    DaBot.say(to, 'Invalid Domain Name or IP Address');
                    return false;
                }
                else if (cmd === 'not')
                {
                    if (!DaBot.regexs.netlogic.exec(args[1]))
                    {
                        DaBot.say(to, 'Invalid IP / Netmask');
                        return false;
                    }
                }
                else if (cmd === 'whois')
                {
                    if (!DaBot.regexs.ipaddr.exec(args[0]))
                    {
                        DaBot.say(to, 'Invalid IP');
                        return false;
                    }
                }
                else if (cmd === 'calc')
                {
                    if (DaBot.regexs.network.exec(args[0]) && !DaBot.regexs.netcidr.exec(args[0]))
                    {
                        if (!args.hasOwnProperty('1'))
                        {
                            DaBot.say(to, 'Missing Netmask / CIDR');
                            return false;
                        }
                        else if (!DaBot.regexs.netmask.exec(args[1]))
                        {
                            DaBot.say(to, 'Invalid Netmask');
                            return false;
                        }
                    }
                    else if (!DaBot.regexs.netcidr.exec(args[0]))
                    {
                        DaBot.say(to, 'Invalid CIDR');
                        return false;
                    }
                }
            }

            switch (cmd)
            {
                case 'ping':
                case 'pong':
                    var ping = new Ping(args[0]);

                    ping.send(function (err, ms) {
                        if (err)
                        {
                            DaBot.say(to, 'Ping Error: ' + err);
                            return false;
                        }

                        if (ms)
                        {
                            DaBot.say(to, args[0] + ' responded in ' + ms + ' ms.');
                            return true;
                        }
                        else
                        {
                            DaBot.say(to, args[0] + ' did not respond.');
                            return true;
                        }
                    });
                    break;
                case 'trace':
                case 'tracert':
                case 'traceroute':
                    var ret = {text: []};
                    //app.say(event.target, 'Trace routing to ' + args[0] + '...');

                    var traceroute = new Traceroute(args[0]);

                    traceroute.on('done', function (err, hops) {
                        var tLines        = [];
                        var hopsProcessed = 0;

                        if (err)
                        {
                            DaBot.say(to, 'Traceroute Error: ' + err);
                            return false;
                        }

                        hops.forEach(function (hop) {
                            ret.text.push(S(hop.counter).padLeft(2).s + ': ' + S((hop.ip) ? hop.ip : '*').padRight(17).s + S((hop.ms) ? hop.ms : '*').padRight(4).s + ' MS');
                            hopsProcessed++;

                            if (hopsProcessed === hops.length)
                            {
                                DaBot.say(to, ret, true);
                            }
                        });
                    });

                    traceroute.start(function (err, hops) {

                    });

                    break;
                case 'port':
                    if (!args[1])
                    {
                        DaBot.say(to, 'You need to specify a port.');
                        return false;
                    }

                    portChecker.isOpen(args[1], args[0], function (isOpen, port, host) {
                        DaBot.say(to, 'Port ' + port + ' on ' + host + ' is ' + (isOpen ? 'open' : 'closed'));
                    });
                    break;

                case 'not':
                    DaBot.say(to, ip.not(args[0]));
                    break;

                case 'calc':
                    // The fun!
                    var info;

                    if (DaBot.regexs.netcidr.exec(args[0]))
                    {
                        info = ip.cidrSubnet(args[0]);

                        DaBot.say(to, [
                            'Network   ' + info.networkAddress,
                            'Netmask   ' + info.subnetMask,
                            'CIDR      /' + info.subnetMaskLength,
                            'Broadcast ' + info.broadcastAddress,
                            'Hosts     ' + info.numHosts,
                            'Usable    ' + info.firstAddress + ' - ' + info.lastAddress,
                        ], true);
                    }
                    else
                    {
                        info = ip.subnet(args[0], args[1]);

                        DaBot.say(to, [
                            'Network   ' + info.networkAddress,
                            'Netmask   ' + info.subnetMask,
                            'CIDR      /' + info.subnetMaskLength,
                            'Broadcast ' + info.broadcastAddress,
                            'Hosts     ' + info.numHosts,
                            'Usable    ' + info.firstAddress + ' - ' + info.lastAddress,
                        ], true);

                    }
                    break;
                case 'whois':
                    whois.whois(args[0], function (err, data) {
                        var org = '???';

                        if (data.hasOwnProperty('Organization'))
                        {
                            org = data.Organization;
                        }
                        else if (data.hasOwnProperty('Registrant Organization'))
                        {
                            org = data['Registrant Organization'];
                        }

                        DaBot.say(to, args[0] + ' is owned by ' + org);
                    });

                    break;

                default:
                    DaBot.say(to, help, true);
            }

        }
        else
        {
            DaBot.say(to, help, true);
        }
    }
};

module.exports = initIP;