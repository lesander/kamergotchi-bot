/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const request = require('request-promise')

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
      console.log('[!] Given player token is not valid.')
      process.exit()
    } else if (error.statusCode === 429) {
      console.log('[!] Too many requests :(')

      // The request failed, so we return the last known good response.
      // this will make the bot do the previous action again.
      // 
      // I know, this is a lazy version of 'exponential backoff', without
      // the back-off implemented ¯\_(ツ)_/¯
      return LAST_RESPONSE

    } else {
      console.log('[!] apiRequest caught an unrecoverable error.')
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
  console.log('[*] Requesting game status.')

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
  console.log('[*] Spending a care point on ' + careType + '. New score is ' + updatedGame.game.score)
  return updatedGame
}

/**
 * Claim the bonus.
 * @return {Promise<Object>}
 */
kamerbotchi.claim = async () => {
  const updatedGame = await kamerbotchi.request('/game/claim', 'POST')
  console.log('[*] Claimed bonus points. New score is ' + updatedGame.game.score)
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
  if (date.current > date.claimReset) {
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
    console.log('[*] Can\'t feed ' + game.gotchi.displayName + ' anymore. Waiting ' + date.remaining + ' seconds.')
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
    console.log('[!] No player token was set, please provide one before continuing.')
    return false
  }

  // Run the bot and await the time we should wait before running again.
  let sleepSeconds = await kamerbotchi.run(PLAYER_TOKEN, CURRENT_GAME)

  // To make the bot stand out less, we add a few extra random
  // waiting seconds to each request. Of course, if there's more
  // requests to send we add less random seconds to the sleep time.
  if (sleepSeconds > 0) {
    sleepSeconds += Math.floor(Math.random() * 60) + 2
  } else {
    sleepSeconds += Math.floor(Math.random() * 3) + 1
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
