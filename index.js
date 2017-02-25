/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const request = require('request-promise')

require('colors')

let kamerbotchi = {}

kamerbotchi.API_ENDPOINT = 'https://api.kamergotchi.nl'
kamerbotchi.CURRENT_GAME = false
kamerbotchi.LAST_RESPONSE = false

/**
 * Output of logs can be useful for CLI apps or for debugging purposes.
 * @type {Boolean}
 */
kamerbotchi.logging = false

/**
 * Send a request to the Kamergotchi API.
 * @private
 * @param  {String} uri
 * @param  {String} method
 * @param  {Object} body
 * @param  {String} token
 * @return {Promise<Object>}
 */
kamerbotchi.request = async (uri, method = 'GET', body = false, token) => {
  let response = false

  // Set the request opions we can fill in right away.
  let options = {
    uri: kamerbotchi.API_ENDPOINT + uri,
    json: true,
    method: method,
    headers: { 'x-player-token': token }
  }

  // If there's a body given, set it in our options.
  if (body) options.body = body

  try {
    // Await the response from the api.
    response = await request(options)
  } catch (error) {
    // Catch any HTTP response errors.
    if (error.statusCode === 401) {
      if (kamerbotchi.logging) {
        console.log('[!] [API] 401 Given player token is not valid.'.red)
      }
      return { error: { message: 'Given player token is not valid.', code: 401 } }
    } else if (error.statusCode === 429) {
      if (kamerbotchi.logging) {
        console.log('[!] [API] 429 Request denied, too many requests.'.yellow)
      }

      // The request failed, so we return the last known good response.
      // this will make the bot do the previous action again.
      //
      // I know, this is a lazy version of 'exponential backoff', without
      // the back-off implemented ¯\_(ツ)_/¯
      //
      // The API will just return the original error.
      if (!kamerbotchi.LAST_RESPONSE) {
        return { error: { message: 'Request denied, too many requests.', code: 429 } }
      }
      return kamerbotchi.LAST_RESPONSE
    } else if (error.statusCode === 504) {
      if (kamerbotchi.logging) {
        console.log('[!] [API] 504 Gateway timeout.'.red)
      }
      return kamerbotchi.LAST_RESPONSE
    } else {
      // We handle all errors above silently because we can recover from those.
      // It's not safe to continue with an unknown error so we stop right here.
      console.log('[!] [API] '.red + String(error.statusCode).red + ' caught an unrecoverable error.'.red)
      console.log(error)
      process.exit(1)
    }
  }

  // Update the current game global object.
  // This saves us a few status requests to the api.
  kamerbotchi.CURRENT_GAME = response.game
  kamerbotchi.LAST_RESPONSE = response

  return response
}

/**
 * Get info of the curent game.
 * @public
 * @param  {String} token
 * @return {Promise<Object>}
 */
kamerbotchi.status = async (token) => {
  const status = await kamerbotchi.request('/game', null, null, token)
  if (kamerbotchi.logging) console.log('    requested game status.'.grey)

  if (status.error) return status

  return status.game
}

/**
 * Spend care points on the given type of care.
 * @public
 * @param  {String}  careType food|knowledge|attention
 * @param  {String}  token
 * @return {Promise<Object>}
 */
kamerbotchi.spendCareOn = async (careType, token) => {
  const updatedGame = await kamerbotchi.request('/game/care', 'POST', { bar: careType }, token)

  if (updatedGame.error) return updatedGame

  if (kamerbotchi.logging) {
    console.log('    Score ' + String(updatedGame.game.score).bold + ' - ' + 'Spent care point on ' + careType.bold)
  }
  return updatedGame.game
}

/**
 * Attempt to claim a points bonus.
 * @public
 * @param  {String} token
 * @return {Promise<Object>}
 */
kamerbotchi.claim = async (token) => {
  const updatedGame = await kamerbotchi.request('/game/claim', 'POST', null, token)

  if (updatedGame.error) return updatedGame

  if (kamerbotchi.logging) {
    console.log('    Score ' + String(updatedGame.game.score).bold + ' - ' + 'Clamed bonus points.'.yellow)
  }
  return updatedGame.game
}

/**
 * Legacy functions.
 */

/**
 * Set the global player token
 * @deprecated since version 2.0.0
 * @param {String} token
 */
kamerbotchi.setToken = (token) => {
  console.log('kamergotchi.setToken has been deprecated since version 2.0.0')
  console.log('Use the `token` parameter for applicable functions instead.')
  return false
}

/**
 * Export the module.
 */
module.exports = kamerbotchi
