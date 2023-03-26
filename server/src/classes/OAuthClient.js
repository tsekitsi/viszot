require('dotenv').config({ path: `${__dirname}/../.env` });
const crypto = require('crypto')
const fetch = require('node-fetch')
const OAuth = require('oauth-1.0a')
const sjcl = require('sjcl')
const DBconn = require('./DBconn')

const OAUTH_KEY = process.env.OAUTH_KEY
const OAUTH_SECRET = process.env.OAUTH_SECRET

class OAuthClient {
  // Zotero OAuth endpoints:
  endpoints = {
    requestToken: 'https://www.zotero.org/oauth/request',
    authorize: 'https://www.zotero.org/oauth/authorize',
    accessToken: 'https://www.zotero.org/oauth/access'
  }

  // callbackUrl = 'https://tseki.ngrok.io/viszot-connect' // redirect to client app.

  constructor(db, userId) {
    this.db = db

    this.state = 0 // this.readState() ? this.readState().state : 0

    this.oauth = (this.state !== 2) ? OAuth({
      consumer: {
        key: OAUTH_KEY,
        secret: OAUTH_SECRET
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64')
      }
    }) : null
  }

  // Request a new request token from the Zotero OAuth server:
  requestRequestToken = async () => {
    const tokenRequestConfig = {
      url: this.endpoints.requestToken,
      method: 'post'
    }

    const raw = (await fetch(this.endpoints.requestToken, {
      headers: this.oauth.toHeader(this.oauth.authorize(tokenRequestConfig)),
      method: 'post'
    })).text()

    const params = new URLSearchParams(await raw)

    return Object.fromEntries(params)
  }

  // Returns the url of the Zotero authorize endpoint with the request token added as a query parameter:
  makeAuthUrl = (token) => `${this.endpoints.authorize}?oauth_token=${token}`

  /*

  // Read OAuth state from db:
  readState = (email) => this.db.filterBy(`email = '${email}'`).then(rows => {
    if (rows.length > 0) {
      return rows[0].state
    }
  })

  // Write OAuth state to db:
  writeState = (email, state) => this.db.updateBy(`email = '${email}'`, 'oauthstate', state)

  // Request a new request token from the Zotero OAuth server:
  requestRequestToken = async () => {
    const tokenRequestConfig = {
      url: this.endpoints.requestToken,
      method: 'post'
    }

    const raw = (await fetch(this.endpoints.requestToken, {
      headers: this.oauth.toHeader(this.oauth.authorize(tokenRequestConfig)),
      method: 'post'
    })).text()

    const params = new URLSearchParams(await raw)

    return Object.fromEntries(params)
  }

  // Save request token to the database:
  saveRequestToken = (requestTokenInfo) => {
    // Make sure the request token has all the information we need:
    if (requestTokenInfo['oauth_token'] && requestTokenInfo['oauth_token_secret']) {
      // Update the db:
      this.db.updateBy(`email = '${this.email}'`, 'requestToken', sjcl.encrypt(MY_ENCR_KEY, JSON.stringify(requestTokenInfo)))
      this.db.updateBy(`email = '${this.email}'`, 'oauthState', 1)
    } else {
      throw new Error('OAuth request token did not contain expected information.')
    }
  }

  // Retrieve the latest request token for this.email from the database (encrypted):
  getRequestTokenEncr = async () => (await this.db.filterBy(`email = '${this.email}'`))[0].requestToken

  // Retrieve and decrypt the latest request token for this.email from the database:
  getRequestToken = async () => {
    const encryptedToken = await this.getRequestTokenEncr()
    if (encryptedToken)
      return JSON.parse(sjcl.decrypt(MY_ENCR_KEY, encryptedToken))
  }

  // Request a new oauth_verifier from the Zotero OAuth server. Redirects to zotero!
  urlForRequestingOAuthVerifier = () => `${authorizeEndpoint}?oauth_token=${this.oauthToken}`

  // Save access token to the database:
  saveAccessToken = (accessTokenInfo) => {
    // Make sure the access token has all the information we need:
    if (accessTokenInfo['oauth_token'] && accessTokenInfo['oauth_token_secret']) {
      // Update the db:
      this.db.updateBy(`email = '${this.email}'`, 'accessToken', sjcl.encrypt(MY_ENCR_KEY, JSON.stringify(accessTokenInfo)))
      this.db.updateBy(`email = '${this.email}'`, 'oauthState', 2)
    } else {
      throw new Error('OAuth access token did not contain expected information.')
    }
  }

  // Retrieve the latest access token for this.email from the database (encrypted):
  getAccessTokenEncr = async () => (await this.db.filterBy(`email = '${this.email}'`))[0].accessToken

  // Retrieve and decrypt the latest access token for this.email from the database:
  getAccessToken = async () => JSON.parse(sjcl.decrypt(MY_ENCR_KEY, (await this.getAccessTokenEncr())))

  ask = () => null

  */
}

module.exports = OAuthClient
