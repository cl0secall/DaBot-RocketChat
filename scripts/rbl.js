'use strict';

const http  = require('http');
const dns   = require('dns');
const async = require('async');
const S     = require('string');
const _     = require('lodash');
const rbls  = [
    "bl.spamcop.net",
    "cbl.abuseat.org",
    "b.barracudacentral.org",
    "dnsbl.sorbs.net",
    "http.dnsbl.sorbs.net",
    "dul.dnsbl.sorbs.net",
    "misc.dnsbl.sorbs.net",
    "smtp.dnsbl.sorbs.net",
    "socks.dnsbl.sorbs.net",
    "spam.dnsbl.sorbs.net",
    "web.dnsbl.sorbs.net",
    "zombie.dnsbl.sorbs.net",
    "dnsbl-1.uceprotect.net",
    "dnsbl-2.uceprotect.net",
    "dnsbl-3.uceprotect.net",
    "pbl.spamhaus.org",
    "sbl.spamhaus.org",
    "xbl.spamhaus.org",
    "zen.spamhaus.org",
    "bl.spamcannibal.org",
    "psbl.surriel.com",
    "ubl.unsubscore.com",
    "dnsbl.njabl.org",
    "combined.njabl.org",
    "rbl.spamlab.com",
    "dyna.spamrats.com",
    "noptr.spamrats.com",
    "spam.spamrats.com",
    "cbl.anti-spam.org.cn",
    "cdl.anti-spam.org.cn",
    "dnsbl.inps.de",
    "drone.abuse.ch",
    "httpbl.abuse.ch",
    "dul.ru korea.services.net",
    "short.rbl.jp",
    "virus.rbl.jp",
    "spamrbl.imp.ch",
    "wormrbl.imp.ch",
    "virbl.bit.nl",
    "rbl.suresupport.com",
    "dsn.rfc-ignorant.org",
    "ips.backscatterer.org",
    "spamguard.leadmon.net",
    "opm.tornevall.org",
    "netblock.pedantic.org",
    "multi.surbl.org",
    "ix.dnsbl.manitu.net",
    "tor.dan.me.uk",
    "rbl.efnetrbl.org",
    "relays.mail-abuse.org",
    "blackholes.mail-abuse.org",
    "rbl-plus.mail-abuse.org",
    "dnsbl.dronebl.org",
    "access.redhawk.org",
    "db.wpbl.info",
    "rbl.interserver.net",
    "query.senderbase.org",
    "bogons.cymru.com",
    "csi.cloudmark.com",
    "bad.psky.me"
];

function reverseIP(ip)
{
    return ip.split('.').reverse().join('.');
}

function checkRBL(ip, rbl, callback)
{
    var rip = reverseIP(ip) + '.' + rbl;

    //console.log('Checking: ' + rip);

    dns.resolve4(rip, function (err, domain) {
        if (err)
        {
            //console.log('(' + rbl + ' ::: ' + rip + ') ERR: ' + err);
            callback(err);
        }
        else
        {
            //console.log('LISTED: ' + rbl);
            callback(null, [ip, rbl]);
        }
    });
}

const initRBL = function (DaBot) {
    const name = 'rbl';
    const help = [
        '======================',
        '==     RBL  Help    ==',
        '======================',
        'Find out if an IP / Domain (might have multiple IPs in its A record) is on an RBL',
        'Usage: !rbl {IP4 Address | Domain name}'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'rbl: Real Time Black List Lookup.');

    DaBot.help.rbl = help;
    DaBot.cmds.rbl = function (to, args, orig) {
        var ips    = [];
        var ret    = [];
        var listed = [];

        if (args.length < 1)
        {
            DaBot.say(to, help);
            return false;
        }

        if (DaBot.regexs.ipaddr.exec(args[0]) || DaBot.regexs.domain.exec(args[0]))
        {
            async.series([
                             function (callback) {
                                 //app.say(event.target, 'Checking RBLs. Please wait...');
                                 callback();
                             },
                             function (callback) {
                                 // Get IP or IPs
                                 if (DaBot.regexs.ipaddr.exec(args[0]))
                                 {
                                     ips.push(args[0]);
                                     callback();
                                 }
                                 else
                                 {
                                     dns.resolve(args[0], 'A', function (err, items) {
                                         if (err)
                                         {
                                             callback(err);
                                         }
                                         else
                                         {
                                             var itemsProcessed = 0;

                                             items.forEach(function (item) {
                                                 ips.push(item);
                                                 itemsProcessed++;

                                                 if (itemsProcessed === items.length)
                                                 {
                                                     callback();
                                                 }
                                             });
                                         }
                                     });
                                 }
                             },
                             function (callback) {
                                 // Get the IANA data
                                 //console.dir(ips);
                                 var options = {
                                     host: 'whois.arin.net',
                                     port: 80,
                                     path: '/rest/ip/' + ips[0] + '.json'
                                 };

                                 http.get(options, function (res) {
                                     var body = '';

                                     res.on('data', function (chunk) {
                                         body += chunk;
                                     });

                                     res.on('end', function () {
                                         var arin = JSON.parse(body);

                                         ret.push('Parent: ' + arin.net.name['$']);

                                         if (arin.net.hasOwnProperty('customerRef'))
                                         {
                                             ret.push('Customer: ' + arin.net.customerRef['@name']);
                                         }

                                         callback();
                                     });
                                 });
                             },
                             function (callback) {
                                 // Loop through the IP(s)
                                 var ipsProcessed = 0;

                                 _.forEach(ips, function (ip) {
                                     var rblsProcessed = 0;

                                     _.forEach(rbls, function (rbl) {
                                         checkRBL(ip, rbl, function (err, res) {
                                             if (err)
                                             {
                                                 // err
                                                 //app.say(event.target, 'ERROR: ' + err);
                                                 //return;
                                             }

                                             if (res)
                                             {
                                                 listed.push(S(res[0]).padRight(17) + 'LISTED: ' + res[1]);
                                             }

                                             rblsProcessed++;

                                             if (rblsProcessed === rbls.length)
                                             {
                                                 ipsProcessed++;

                                                 if (ipsProcessed === ips.length)
                                                 {
                                                     callback();
                                                 }
                                             }
                                         });
                                     });

                                 });
                             }
                         ],
                         function (err) {
                             // Main callback
                             if (err)
                             {
                                 //app.say(event.target, err);
                                 DaBot.say(to, err);
                             }
                             else
                             {
                                 DaBot.say(to, (listed.length > 0) ? listed : 'Nothing found on the RBLs');
                             }
                         });
        }
        else
        {
            DaBot.say(to, help, true);
        }
    };

};

module.exports = initRBL;