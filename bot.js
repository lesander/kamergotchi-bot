/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const kamerbotchi = require('./index.js')
const colors = require('colors')
const latestVersion = require('latest-version')

let bot = {}

const startBot = async () => {

  // Enable logging output.
  kamerbotchi.logging = true

  // Get current and latest versions.
  const cv = require('./package.json').version
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
  kamerbotchi.PLAYER_TOKEN = process.argv[2]
  bot.init()

}

/**
 * Main bot loop.
 * @private
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise}
 */
bot.init = async () => {
  // Make sure a token was passed on somehow.
  if (!kamerbotchi.PLAYER_TOKEN) {
    console.log('[!] No player token was set, please provide one before continuing.'.red)
    return false
  }

  // Run the bot and await the time we should wait before running again.
  let sleepSeconds = await bot.run(kamerbotchi.PLAYER_TOKEN, kamerbotchi.CURRENT_GAME)

  // To make the bot stand out less, we add a few extra random
  // waiting seconds before making a new request.
  // Of course, if there's more requests to send we do not add extra sleep seconds.
  if (sleepSeconds > 0) {
    sleepSeconds += Math.floor(Math.random() * 20) + 2
    console.log('    hibernating for '.grey + String(sleepSeconds).grey + ' seconds..'.grey)
  } else {
    sleepSeconds += 1
  }

  // setTimeout takes milliseconds as a parameter, so we better convert
  // those seconds. :)
  const sleepMilliseconds = sleepSeconds * 1000

  // Wait for x milliseconds before running again.
  setTimeout(() => {
    bot.init()
  }, sleepMilliseconds)
}

/**
 * Check what we can and cannot do with the current game.
 * @private
 * @param  {String}  token
 * @return {Promise<Integer>}
 */
bot.run = async (token, game) => {
  // Get game status if none has been requested yet.
  if (typeof game !== 'object') {
    game = await kamerbotchi.status(token)
  }

  // Format the given dates to seconds.
  let date = {
    current: Math.round(new Date().getTime() / 1000),
    careReset: Math.round(new Date(game.careReset).getTime() / 1000),
    claimReset: Math.round(new Date(game.claimReset).getTime() / 1000),
    remaining: 0
  }

  // Is a claim available?
  // We want the highest available claim,
  // so we wait until there's no care points left to spend.
  //
  // Also, because of a bug in the Kamergotchi API, we wait
  // until it is likely no further requests are running. This
  // is to make sure our bonus score is correctly registered in
  // the Kamergotchi database.
  if (date.current > date.claimReset && game.careLeft === 0) {
    setTimeout(() => {
      kamerbotchi.claim(token)
    }, 10000)
  }

  // Any 'care' points available to spend?
  // For some reason, careLeft stays 0, even after careReset has passed.
  if (game.careLeft > 0 || date.current > date.careReset) {
    // Let our algorithm determine what to spend a care point on.
    await bot.determineRequiredCare(game, token)
    return 0
  } else {
    // Well, all we can do here is wait..
    // Calculate the time in seconds before we try again.
    date.remaining = date.careReset - date.current
    console.log('[*] Can\'t feed ' + game.gotchi.displayName + ' (' + game.gotchi.party + ') anymore, ' + date.remaining + ' seconds remaining.')
    return date.remaining
  }
}

/**
 * Calculate what we should spend one 'care' point on.
 * @private
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise<Object>}
 */
bot.determineRequiredCare = async (game, token) => {
  // If our food level is lower than our attention level,
  // and our knowledge is lower than our food level, we go for knowledge.
  //
  // If our food level is lower than our attention level,
  // and our knowledge is higher than our food level, we go for food.
  //
  // If our food level is higher than our attention level,
  // and our attention level is lower than our knowledge level, we go for attention.
  //
  // If our food level is higher than our attention level,
  // and our attention level is higher than our knowledge level, we go for knowledge.

  if (game.current.food < game.current.attention) {
    if (game.current.knowledge < game.current.food) {
      return await kamerbotchi.spendCareOn('knowledge', token)
    } else {
      return await kamerbotchi.spendCareOn('food', token)
    }
  } else {
    if (game.current.attention < game.current.knowledge) {
      return await kamerbotchi.spendCareOn('attention', token)
    } else {
      return await kamerbotchi.spendCareOn('knowledge', token)
    }
  }
}

startBot()
