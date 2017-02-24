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
</p>
<hr>

```
KamerBOTchi v1.4.0
Developed with <3 by Sander Laarhoven
https://git.io/kamergotchi

[*] Player token is set to xxx
    requested game status.
[*] Can't feed Sylvana (Artikel 1) anymore, 115 seconds remaining.
    hibernating for 121 seconds..
    Score 19471 Spent care point on knowledge
    Score 19476 Spent care point on knowledge
    Score 19481 Spent care point on knowledge
    Score 19486 Spent care point on knowledge
    Score 19491 Spent care point on knowledge
    Score 19496 Spent care point on knowledge
    Score 19501 Spent care point on knowledge
    Score 19506 Spent care point on knowledge
    Score 19511 Spent care point on knowledge
    Score 19516 Spent care point on knowledge
[*] Can't feed Sylvana (Artikel 1) anymore, 409 seconds remaining.
    hibernating for 426 seconds..
```

## Getting started

This module is both a CLI program and a Node module.
The most common way to get started is to download the `kamergotchi` package from NPM.

```shell
npm install -g kamergotchi
kamergotchi {myPlayerToken}
```

To get started with the bot, you will have to find out your kamergotchi `x-player-token` through a simple MITM attack using a proxy on your phone. I recommend [Burp Suite](https://support.portswigger.net/customer/portal/articles/1841108-configuring-an-ios-device-to-work-with-burp).

When you've obtained a player token, replace `{myPlayerToken}` with your token and run the program. You can check the progress of the bot on your phone in the Kamergotchi app.

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
