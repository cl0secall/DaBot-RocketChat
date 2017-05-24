'use strict';

const initConvert = function (DaBot) {
    const name = 'convert';
    const help = [
        '===========================',
        '==     Convert  Help     ==',
        '===========================',
        'Coverts data units',
        'b,B,Kb,KM,Mb,MB,Gb,GB,Tb,TB,Pb,PB,Eb,EB,Zb,ZB,Yb,YB',
        'Usage:',
        DaBot.config.app.triggerPrefix + 'convert 1024Kb MB',
        DaBot.config.app.triggerPrefix + 'convert 1024Mb Kb',
        DaBot.config.app.triggerPrefix + 'convert 1024PB Mb'
    ];

    DaBot.help.DaBot.push(DaBot.config.app.triggerPrefix + 'convert: Data Unit Converter.');

    DaBot.help.convert    = help;
    DaBot.cmds['convert'] = function (to, args, orig) {
        const unitRegex = /(.*?)(YB|Yb|ZB|Zb|EB|Eb|PB|Pb|TB|Tb|GB|Gb|MB|Mb|KB|Kb|B|b) (YB|Yb|ZB|Zb|EB|Eb|PB|Pb|TB|Tb|GB|Gb|MB|Mb|KB|Kb|B|b)/g;
        const bitRegex  = /(.*?)b/g;
        const byteRegex = /(.*?)B/g;
        var conv        = '';
        var values;
        var units;
        var val;
        var unitFrom;
        var unitTo;

        DaBot.help[name] = help;

        if (args && args.match(unitRegex))
        {
            values   = unitRegex.exec(args);
            val      = values[1];
            unitFrom = values[2];
            unitTo   = values[3];

            units = {
                b: 1,
                B: 1,
                Kb: 1000,
                KB: 1024,
                Mb: 1000000,
                MB: 1048576,
                Gb: 1000000000,
                GB: 1073741824,
                Tb: 1000000000000,
                TB: 1099511627776,
                Pb: 1000000000000000,
                PB: 1125899906842624,
                Eb: 1000000000000000000,
                EB: 1152921504606846976,
                Zb: 1000000000000000000000,
                ZB: 1180591620717411303424,
                Yb: 1000000000000000000000000,
                YB: 1208925819614629174706176
            };

            switch (unitFrom)
            {
                case 'YB':
                case 'ZB':
                case 'EB':
                case 'PB':
                case 'TB':
                case 'GB':
                case 'MB':
                case 'KB':
                case 'B':
                    if (units[unitFrom] > units[unitTo])
                    {
                        conv = val * (units[unitFrom] / units[unitTo.toUpperCase()]);

                        if (unitTo.match(bitRegex))
                        {
                            conv = conv * 8;
                        }

                        DaBot.say(to, '' + val + unitFrom + ' = ' + conv + unitTo);
                    }
                    else
                    {

                        conv = val / (units[unitTo.toUpperCase()] / units[unitFrom]);

                        if (unitTo.match(bitRegex))
                        {
                            conv = conv * 8;
                        }

                        DaBot.say(to, '' + val + unitFrom + ' = ' + conv + unitTo);
                    }
                    break;
                case 'Yb':
                case 'Zb':
                case 'Eb':
                case 'Pb':
                case 'Tb':
                case 'Gb':
                case 'Mb':
                case 'Kb':
                case 'b':
                    if (units[unitFrom] > units[unitTo])
                    {
                        conv = val * (units[unitFrom] / units[unitTo.charAt(0) + unitTo.charAt(1).toLowerCase()]);

                        if (unitTo.match(byteRegex))
                        {
                            conv = conv / 8;
                        }

                        DaBot.say(to, '' + val + unitFrom + ' = ' + conv + unitTo);
                    }
                    else
                    {
                        conv = (unitTo !== 'b') ? val / (units[unitTo.charAt(0) + unitTo.charAt(1).toLowerCase()] / units[unitFrom]) : val / (units['b'] / units[unitFrom]);

                        if (unitTo.match(byteRegex))
                        {
                            conv = conv / 8;
                        }

                        DaBot.say(to, '' + val + unitFrom + ' = ' + conv + unitTo);
                    }
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

module.exports = initConvert;