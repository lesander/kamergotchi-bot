/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const kamerbotchi = require('../index.js')

async function init () {
  kamerbotchi.setToken('my-test-token-here')
  const status = await kamerbotchi.status()
  console.log(status)
}

init()
