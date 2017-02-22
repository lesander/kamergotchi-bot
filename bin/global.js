#!/usr/bin/env node --harmony-async-await

const kamerbotchi = require('../index.js')

console.log('KamerBOTchi v'+require('../package.json').version)
console.log('Developed with <3 by Sander Laarhoven')
console.log('https://git.io/kamergotchi')
console.log('\nPlayer token is set to ' + process.argv[2])
kamerbotchi.setToken(process.argv[2])
kamerbotchi.init()
