/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const kamerbotchi = require('../index.js')
require('colors')

async function init () {

  let playerObject

  // Test registering of new player.
  console.log('   Trying to register a new player..'.grey)
  const nickname = 'kamerbotchi_' + Math.floor(Math.random() * 1000000)
  playerObject = await kamerbotchi.register(nickname)
  //console.log(playerObject)

  if (typeof playerObject !== 'object') {
    console.log(' ✗ Returned playerObject is not an object.'.red)
    process.exit(1)
  } else if (typeof playerObject.error !== 'undefined') {
    if (playerObject.error.code === 429) {
      console.log(String(' ✗ Returned playerObject contains passable ' + playerObject.error.code + ' error.').yellow)
    } else {
      console.log(' ✗ Returned playerObject contains ' + playerObject.error.code + ' error.'.red)
      process.exit(1)
    }
  } else {
    console.log(String('   Our token is ' + playerObject.player.token).grey)
    console.log(String('   Gotchi ' + playerObject.player.currentGame.gotchi.displayName + ' is doing just fine.').grey)
  }

  /*
  // Test with bogus token.
  console.log('   Trying claim bonus with invalid player token..'.grey)
  updatedGame = await kamerbotchi.claim(process.env.INVALID_PLAYER_TOKEN)

  if (typeof updatedGame !== 'object' || typeof updatedGame.error !== 'object') {
    console.log(' ✗ Returned updatedGame does not have error object.'.red)
    process.exit(1)
  } else {
    console.log('   Invalid player token is not working, as expected.'.grey)
  }*/

}

init()
