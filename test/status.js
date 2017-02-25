/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const kamerbotchi = require('../index.js')
require('colors')

async function init () {

  let status

  // Test with working token.
  console.log('   Testing status with working player token..'.grey)
  kamerbotchi.setToken(process.env.WORKING_PLAYER_TOKEN)
  status = await kamerbotchi.status()

  if (typeof status !== 'object') {
    console.log(' ✗ Returned status is not an object.'.red)
    process.exit(1)
  } else if (typeof status.error !== 'undefined') {
    console.log(' ✗ Returned status contains ' + updatedGame.error.code + ' error.'.red)
    process.exit(1)
  } else {
    console.log(String('   Gotchi ' + status.gotchi.displayName + ' is doing just fine.').grey)
  }

  // Test with bogus token.
  console.log('   Testing status with invalid player token..'.grey)
  kamerbotchi.setToken(process.env.INVALID_PLAYER_TOKEN)
  status = await kamerbotchi.status()

  if (typeof status !== 'object' || typeof status.error !== 'object') {
    console.log(' ✗ Returned status does not have error object.'.red)
    process.exit(1)
  } else {
    console.log('   Invalid player token is not working, as expected.'.grey)
  }

}

init()
