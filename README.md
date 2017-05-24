# DaBot for Rocket.Chat
DDP client based bot for Rocket.Chat

### Installation
* Download.
* Run `npm init`.
* Copy `config/app.js.example` to `config/app.js`.
* Change configuartion settings.
* Run `node index.js`

### Scripting
Files are in the `/scripts` directory. You'll need to add the name to the `/config/app.js` file, in the `scripts` array to activate it.

There are bascially two important methods:

```
DaBot.say(to, message, preformat)
to: string - @user, #room or RID 
message: string or array
preformat: boolean

DaBot.joinRoom(room);
room: string - #room or RID
````