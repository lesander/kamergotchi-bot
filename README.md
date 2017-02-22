# KamerBOTchi
[![kamergotchi](https://img.shields.io/npm/v/kamergotchi.svg?mmaxAge=-1)](https://www.npmjs.com/package/kamergotchi)
[![kamergotchi](https://img.shields.io/npm/dt/kamergotchi.svg?maxAge=-1)](https://www.npmjs.com/package/kamergotchi)

*Automatically take care of your favorite dutch politician.*

A Node.js [Kamergotchi](https://kamergotchi.nl) bot.

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
The most common way to get started is described below.

```shell
npm install -g kamergotchi
kamergotchi {myPlayerToken}
```

To get started, you will have to find out your kamergotchi player token through a simple MITM attack using a proxy on your phone. I recommend [Burp Suite](https://support.portswigger.net/customer/portal/articles/1841108-configuring-an-ios-device-to-work-with-burp).

When you've obtained a player token, replace `{myPlayerToken}` with your token.
