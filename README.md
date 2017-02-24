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
KamerBOTchi v1.3.2
Developed with <3 by Sander Laarhoven
https://git.io/kamergotchi

Player token is set to xxx
[*] Requesting game status.
[*] Can't feed Sylvana anymore. Waiting 158 seconds.
[*] Spending a care point on knowledge. New score is 5802
[*] Spending a care point on food. New score is 5807
[*] Spending a care point on knowledge. New score is 5812
[*] Spending a care point on food. New score is 5817
[*] Spending a care point on attention. New score is 5822
[*] Spending a care point on attention. New score is 5827
[*] Spending a care point on knowledge. New score is 5832
[*] Spending a care point on knowledge. New score is 5837
[*] Spending a care point on food. New score is 5842
[*] Spending a care point on attention. New score is 5847
[*] Can't feed Sylvana anymore. Waiting 400 seconds.
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

## Contributing
If you'd like to contribute to this project, or file a bug or feature request, please head over to [the issue tracker](https://github.com/lesander/kamergotchi-bot/issues) or [open a pull request](https://github.com/lesander/kamergotchi-bot/pulls).

## License
Copyright (c) 2017 Sander Laarhoven All Rights Reserved.

This software is open-sourced under the MIT License ([see the LICENSE file for the full license](https://github.com/lesander/kamergotchi-bot/blob/master/LICENSE)). So within some limits, you can do with the code whatever you want. However, if you like and/or want to re-use it, I'd really appreciate a reference to this project page.

The software is provided as is. It might work as expected - or not. Just don't blame me.
