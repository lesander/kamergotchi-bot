# KamerBOTchi
[![kamergotchi](https://img.shields.io/npm/v/kamergotchi.svg)]()
[![kamergotchi](https://img.shields.io/npm/dt/kamergotchi.svg)]()

*Automatically take care of your favorite dutch politician.*

A Node.js [Kamergotchi](https://kamergotchi.nl) bot.

```
KamerBOTchi v1.3.0
Developed with <3 by Sander Laarhoven
https://git.io/kamergotchi

Player token is set to xxx
[*] Requesting game status.
[*] Spending a care point on attention. New score is 5002
[*] Spending a care point on food. New score is 5007
[*] Spending a care point on knowledge. New score is 5012
[*] Spending a care point on attention. New score is 5017
[*] Spending a care point on food. New score is 5022
[*] Spending a care point on knowledge. New score is 5027
[*] Spending a care point on attention. New score is 5032
[*] Spending a care point on food. New score is 5037
[*] Spending a care point on knowledge. New score is 5042
[*] Spending a care point on knowledge. New score is 5047
[*] 397 seconds remaining. Can't feed Pechtold yet.

```

## Getting started

This module is both a CLI program and a Node module.
The most common way to get started is described below.

```shell
npm install -g kamergotchi
kamergotchi {myPlayerToken}
```

To get started, you will have to find out your kamergotchi player token through a simple MITM attack using a proxy on your phone. I recommend [Burp Suite](https://support.portswigger.net/customer/portal/articles/1841108-configuring-an-ios-device-to-work-with-burp).

When you've obtained a player token, replace `{myPlayerToken}` with your token.
