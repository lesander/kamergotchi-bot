# KamerBOTchi

*Automatically take care of your favorite dutch politician.*

A Node.js [Kamergotchi](https://kamergotchi.nl) bot.

## Getting started

This module is both a CLI program and a Node module.
The most common way to get started is described below.

```shell
npm install kamergotchi
node --harmony-async-await index.js {myPlayerToken}
```

To get started, you will have to find out your kamergotchi player token through a simple MITM attack using a proxy on your phone. I recommend [Burp Suite](https://support.portswigger.net/customer/portal/articles/1841108-configuring-an-ios-device-to-work-with-burp). You can also create a new gotchi with `kamerbotchi.create()`.

When you've obtained a player token, replace `{myPlayerToken}` with your token.
