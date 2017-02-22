#!/bin/sh
":" //# http://sambal.org/?p=1014 ; exec /usr/bin/env node --harmony-async-await "$0" "$@"

const kamerbotchi = require('../index.js')

console.log('KamerBOTchi v'+require('../package.json').version)
console.log('Developed with <3 by Sander Laarhoven')
console.log('https://git.io/kamergotchi')
console.log('\nPlayer token is set to ' + process.argv[2])

if (typeof process.argv[2] === 'undefined' || !process.argv[2]) {
  console.log('No player token given.\nUsage: `kamergotchi [playerToken]`')
  process.exit()
}

kamerbotchi.setToken(process.argv[2])
kamerbotchi.init()
