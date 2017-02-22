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

let kamerbotchi = {}

/**
 * Set the player token
 * @param {String} token
 */
kamerbotchi.setToken = (token) => {
  PLAYER_TOKEN = token
}

/**
 * Send a request to the Kamergotchi API.
 * @param  {String} method
 * @param  {Object} body
 * @return {Promise}
 */
kamerbotchi.request = async (uri, method = 'GET', body = false) => {
  let response = false
  let options = {
    uri: API_ENDPOINT + uri,
    json: true,
    method: method,
    headers: { 'x-player-token': PLAYER_TOKEN }
  }
  if (body) options.body = body

  try {
    response = await request(options)
  } catch (error) {
    console.log('[!] apiRequest caught error')

    if (error.statusCode === 401) {
      console.log('[!] Given player token is not valid.')
    } else {
      console.log(error)
    }

    process.exit()
  }

  CURRENT_GAME = response.game

  return response
}

/**
 * Get info of the curent game.
 * @param  {String} [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.status = async (token = PLAYER_TOKEN) => {
  const status = await kamerbotchi.request('/game')
  console.log('[*] Requesting game status.')
  return status.game
}

/**
 * Calculate what we should spend one 'care' point on.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.determineRequiredCare = async (game) => {
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
 * @return {Promise}
 */
kamerbotchi.spendCareOn = async (careType) => {
  const updatedGame = await kamerbotchi.request('/game/care', 'POST', { bar: careType })
  console.log('[*] Spending a care point on ' + careType + '. New score is ' + updatedGame.game.score)
  return updatedGame
}

/**
 * Claim the bonus.
 * @return {Promise}
 */
kamerbotchi.claim = async () => {
  const updatedGame = await kamerbotchi.request('/game/claim', 'POST')
  console.log('[*] Claimed points bonus. New score is ' + updatedGame.game.score)
  return updatedGame
}

/**
 * Check what we can and cannot do with the current game.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.run = async (token = PLAYER_TOKEN, game = CURRENT_GAME) => {

  // Get game status if none has been requested yet.
  if (typeof game !== 'object') {
    game = await kamerbotchi.status()
  }

  // Format dates to seconds.
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
  // For some reason, careLeft stays 0, even
  // after careReset has passed.
  if (game.careLeft > 0 || date.current > date.careReset) {
    const updatedGame = await kamerbotchi.determineRequiredCare(game)
    return 0
  } else {
    date.remaining = date.careReset - date.current
    console.log('[*] ' + date.remaining + ' seconds remaining. Can\'t feed ' + game.gotchi.displayName + ' yet.')
    return date.remaining
  }
}

/**
 * Main bot loop.
 * @param  {String}  [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.init = async () => {

  if (!PLAYER_TOKEN) {
    console.log('[!] No player token was set, please provide one before continuing.')
    return false
  }

  let sleepSeconds = await kamerbotchi.run(PLAYER_TOKEN, CURRENT_GAME)

  if (sleepSeconds > 0) {
    sleepSeconds += Math.floor(Math.random() * 60) + 2
  } else {
    sleepSeconds += Math.floor(Math.random() * 3) + 1
  }

  setTimeout(() => {
    kamerbotchi.init()
  }, sleepSeconds * 1000)
}

/**
 * Export the module.
 */
module.exports = kamerbotchi

/**
 * Was the script called from CLI?
 */
if (require.main === module) {
  console.log('KamerBOTchi v'+require('./package.json').version)
  console.log('Developed with <3 by Sander Laarhoven')
  console.log('https://git.io/kamergotchi')
  console.log('\nPlayer token is set to ' + process.argv[2])
  kamerbotchi.setToken(process.argv[2])
  kamerbotchi.init()
}
