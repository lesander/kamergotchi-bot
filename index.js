/**
 * kamergotchi-bot v1.0.0
 * By Sander Laarhoven
 * Licensed under the MIT License
 * https://git.io/kamergotchi
 */

const request = require('request-promise')

PLAYER_TOKEN = ''
API_ENDPOINT = 'https://api.kamergotchi.nl/'

let kamerbotchi = {}

/**
 * Send a request to the Kamergotchi API.
 * @param  {string} method
 * @param  {object} body
 * @return {promise}
 */
kamerbotchi.request = async (method, body) => {

  let response = false
  let options = {
    uri: API_ENDPOINT + method,
    json: true,
    headers: { 'x-player-token': PLAYER_TOKEN }
  }

  if (body) options.body = body

  try {
    response = await request(options)
  } catch (error) {
    console.log('[!] apiRequest caught error', error)
  }

  return response

}

/**
 * Get info of the curent game.
 * @param  {string} [token=PLAYER_TOKEN]
 * @return {Promise}
 */
kamerbotchi.status = async (token = PLAYER_TOKEN) => {
  const game = await kamerbotchi.request('game')
  return game
}

/**
 * Export the module.
 */
module.exports = kamerbotchi
