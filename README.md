<h1 align="center">KamerBOTchi</h1>

<p align="center">
  <img src="bin/kamerbotchi.png">
</p>

<p align="center">
  Automatically take care of your favorite dutch politician.
</p>

<p align="center">
  A Node.js <a href="https://kamergotchi.nl">Kamergotchi</a> bot.
</p>

<hr>
<p align="center">
<img src="https://img.shields.io/npm/v/kamergotchi.svg?mmaxAge=-1">
<img src="https://img.shields.io/npm/dt/kamergotchi.svg?maxAge=-1">
<img src="https://travis-ci.org/lesander/kamergotchi-bot.svg?branch=master">
</p>
<hr>

```
KamerBOTchi v1.4.1
Developed with <3 by Sander Laarhoven
https://git.io/kamergotchi

[*] Player token is set to xxx
    requested game status.
[*] Can't feed Sylvana (Artikel 1) anymore, 319 seconds remaining.
    hibernating for 339 seconds..
    Score 19571 - Spent care point on knowledge
    Score 19576 - Spent care point on knowledge
    Score 19581 - Spent care point on knowledge
    Score 19586 - Spent care point on knowledge
    Score 19591 - Spent care point on knowledge
    Score 19596 - Spent care point on knowledge
    Score 19601 - Spent care point on knowledge
    Score 19606 - Spent care point on knowledge
    Score 19611 - Spent care point on knowledge
    Score 19616 - Spent care point on knowledge
[*] Can't feed Sylvana (Artikel 1) anymore, 409 seconds remaining.
    hibernating for 421 seconds..
```

## Getting started

This package is both a CLI program and a Node module.
The easiest way to get started is to download the `kamergotchi` package from NPM.

```shell
npm install -g kamergotchi
kamergotchi {myPlayerToken}
```

To get started with the bot, you will have to find out your kamergotchi `x-player-token` through a simple MITM attack using a proxy on your phone. I recommend [Burp Suite](https://support.portswigger.net/customer/portal/articles/1841108-configuring-an-ios-device-to-work-with-burp).

When you've obtained a player token, replace `{myPlayerToken}` with your token and run the program. You can check the progress of the bot on your phone in the Kamergotchi app.

## Module
As stated, this package can also be used as a module in your NodeJS script. This module exposes several functions to utilize the Kamergotchi API yourself.

```nodejs
const bot = require('kamergotchi')

let status = await bot.status(token)

if (status.error) {
  console.log(status.error.message)
} else {
  console.log('current score is ' + status.score)
}
```

## Updating
To update your `kamergotchi-bot` to a newer version, run the following command.
```shell
npm update -g kamergotchi
```

## Contributing
If you'd like to contribute to this project, or file a bug or feature request, please head over to [the issue tracker](https://github.com/lesander/kamergotchi-bot/issues) or [open a pull request](https://github.com/lesander/kamergotchi-bot/pulls).

## License
Copyright (c) 2017 Sander Laarhoven All Rights Reserved.

This software is open-sourced under the MIT License ([see the LICENSE file for the full license](https://github.com/lesander/kamergotchi-bot/blob/master/LICENSE)). So within some limits, you can do with the code whatever you want. However, if you like and/or want to re-use it, I'd really appreciate a reference to this project page.

The software is provided as is. It might work as expected - or not. Just don't blame me.
