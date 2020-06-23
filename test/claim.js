/**
 * kamergotchi-bot v1.0.0
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const kamerbotchi = require('../index.js')
require('colors')

async function init () {

  let updatedGame

  // Test with working token.
  console.log('   Trying claim bonus with working token..'.grey)
  updatedGame = await kamerbotchi.claim(process.env.WORKING_PLAYER_TOKEN)

  if (typeof updatedGame !== 'object') {
    console.log(' ✗ Returned updatedGame is not an object.'.red)
    process.exit(1)
  } else if (typeof updatedGame.error !== 'undefined') {
    if (updatedGame.error.code === 429) {
      console.log(String(' ✗ Returned updatedGame contains passable ' + updatedGame.error.code + ' error.').yellow)
    } else {
      console.log(' ✗ Returned updatedGame contains ' + updatedGame.error.code + ' error.'.red)
      process.exit(1)
    }
  } else {
    console.log(String('   Gotchi ' + updatedGame.gotchi.displayName + ' is doing just fine.').grey)
  }

  // Test with bogus token.
  console.log('   Trying claim bonus with invalid player token..'.grey)
  updatedGame = await kamerbotchi.claim(process.env.INVALID_PLAYER_TOKEN)

  if (typeof updatedGame !== 'object' || typeof updatedGame.error !== 'object') {
    console.log(' ✗ Returned updatedGame does not have error object.'.red)
    process.exit(1)
  } else {
    console.log('   Invalid player token is not working, as expected.'.grey)
  }

}

init()
