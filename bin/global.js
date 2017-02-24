#!/bin/sh
":" //# http://sambal.org/?p=1014 ; exec /usr/bin/env node --harmony-async-await "$0" "$@"

const kamerbotchi = require('../index.js')
const colors = require('colors')
const latestVersion = require('latest-version')

const init = async () => {

  // Get current and latest versions.
  const cv = require('../package.json').version
  const lv = await latestVersion('kamergotchi')

  // Say hi!
  console.log('KamerBOTchi'.yellow.bold + ' v'.yellow + cv.yellow)
  console.log('Developed with <3 by Sander Laarhoven'.grey)
  console.log('https://git.io/kamergotchi'.grey.underline)
  console.log('')

  // Compare current version with the latest NPM version.
  // Assume that if the versions don't match, the current package
  // is outdated.
  if (cv !== lv) {
    console.log('[!] A new version ('.red + lv.red + ') of KamerBOTchi is available on NPM!'.red)
    console.log('    Run `npm update -g kamergotchi` to update the global package.'.red)
  }

  // Make sure we're giving kamerbotchi a player token.
  if (typeof process.argv[2] === 'undefined' || !process.argv[2]) {
    console.log('[!] No player token given.'.red)
    console.log('    Usage: `kamergotchi [playerToken]`'.red)
    process.exit()
  } else {
    console.log('[*] Player token is set to ' + process.argv[2].yellow)
  }

  // Set token and initialize!
  kamerbotchi.setToken(process.argv[2])
  kamerbotchi.init()

}

init()
