/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const request = require('request-promise')

require('colors')

const API_ENDPOINT = 'https://api.kamergotchi.nl'
let PLAYER_TOKEN = ''
let CURRENT_GAME = false
let LAST_RESPONSE = false

let kamerbotchi = {}

/**
 * Set the global player token
 * @param {String} token
 */
kamerbotchi.setToken = (token) => {
  PLAYER_TOKEN = token
}

/**
 * Send a request to the Kamergotchi API.
 *
 * @param  {String} method
 * @param  {Object} body
 * @return {Promise<Object>}
 */
kamerbotchi.request = async (uri, method = 'GET', body = false) => {
  let response = false

  // Set the request opions we can fill in right away.
  let options = {
    uri: API_ENDPOINT + uri,
    json: true,
    method: method,
    headers: { 'x-player-token': PLAYER_TOKEN }
  }

  // If there's a body given, set it in our options.
  if (body) options.body = body

  try {
    // Await the response from the api.
    response = await request(options)
  } catch (error) {
    // Catch any HTTP response errors.
    if (error.statusCode === 401) {
      console.log('[!] [API] 401 Given player token is not valid.'.red)
      process.exit()
    } else if (error.statusCode === 429) {
      console.log('[!] [API] 429 Request denied, too many requests.')

      // The request failed, so we return the last known good response.
      // this will make the bot do the previous action again.
      //
      // I know, this is a lazy version of 'exponential backoff', without
      // the back-off implemented ¯\_(ツ)_/¯
      return LAST_RESPONSE
    } else if (error.statusCode === 504) {
      console.log('[!] [API] 504 Gateway timeout.'.red)
      return LAST_RESPONSE
    } else {
      console.log('[!] [API] '.red + String(error.statusCode).red + ' caught an unrecoverable error.'.red)
      console.log(error)
      process.exit()
    }
  }

  // Update the current game global object.
  // This saves us a few status requests to the api.
  CURRENT_GAME = response.game
  LAST_RESPONSE = response

  return response
}

/**
 * Get info of the curent game.
 * @param  {String} [token=PLAYER_TOKEN]
 * @return {Promise<Object>}
 */
kamerbotchi.status = async (token = PLAYER_TOKEN) => {
  const status = await kamerbotchi.request('/game')
  console.log('    requested game status.'.grey)

  return status.game
}

/**
 * Calculate what we should spend one 'care' point on.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise<Object>}
 */
kamerbotchi.determineRequiredCare = async (game) => {
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
      return await kamerbotchi.spendCareOn('knowledge')
    } else {
      return await kamerbotchi.spendCareOn('food')
    }
  } else {
    if (game.current.attention < game.current.knowledge) {
      return await kamerbotchi.spendCareOn('attention')
    } else {
      return await kamerbotchi.spendCareOn('knowledge')
    }
  }
}

/**
 * Spend care points on the given type of care.
 * @param  {String}  careType food|knowledge|attention
 * @return {Promise<Object>}
 */
kamerbotchi.spendCareOn = async (careType) => {
  const updatedGame = await kamerbotchi.request('/game/care', 'POST', { bar: careType })
  console.log('    Score ' + String(updatedGame.game.score).bold + ' - ' + 'Spent care point on ' + careType.bold)
  return updatedGame
}

/**
 * Claim the bonus.
 * @return {Promise<Object>}
 */
kamerbotchi.claim = async () => {
  const updatedGame = await kamerbotchi.request('/game/claim', 'POST')
  console.log('    Score ' + String(updatedGame.game.score).bold + ' - ' + 'Clamed bonus points.'.yellow)
  return updatedGame
}

/**
 * Check what we can and cannot do with the current game.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise<Integer>}
 */
kamerbotchi.run = async (token = PLAYER_TOKEN, game = CURRENT_GAME) => {
  // Get game status if none has been requested yet.
  if (typeof game !== 'object') {
    game = await kamerbotchi.status()
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
  if (date.current > date.claimReset && game.careLeft === 0) {
    kamerbotchi.claim(token, game)
  }

  // Any 'care' points available to spend?
  // For some reason, careLeft stays 0, even after careReset has passed.
  if (game.careLeft > 0 || date.current > date.careReset) {
    // Let our algorithm determine what to spend a care point on.
    await kamerbotchi.determineRequiredCare(game)
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
 * Main bot loop.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.init = async () => {
  // Make sure a token was passed on somehow.
  if (!PLAYER_TOKEN) {
    console.log('[!] No player token was set, please provide one before continuing.'.red)
    return false
  }

  // Run the bot and await the time we should wait before running again.
  let sleepSeconds = await kamerbotchi.run(PLAYER_TOKEN, CURRENT_GAME)

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
    kamerbotchi.init()
  }, sleepMilliseconds)
}

/**
 * Export the module.
 */
module.exports = kamerbotchi
