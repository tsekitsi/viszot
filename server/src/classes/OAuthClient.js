require('dotenv').config({ path: `${__dirname}/../.env` });
const crypto = require('crypto')
const fetch = require('node-fetch')
const OAuth = require('oauth-1.0a')
const sjcl = require('sjcl')
const DBconn = require('./DBconn')

const MY_ENCR_KEY = process.env.MY_ENCR_KEY
const OAUTH_KEY = process.env.OAUTH_KEY
const OAUTH_SECRET = process.env.OAUTH_SECRET

class OAuthClient {
  // Zotero OAuth endpoints:
  requestTokenEndpoint = 'https://www.zotero.org/oauth/request'
  authorizeEndpoint = 'https://www.zotero.org/oauth/authorize'
  accessTokenEndpoint = 'https://www.zotero.org/oauth/access'

  callbackUrl = 'https://tseki.ngrok.io/viszot-connect' // redirect to client app.

  db = new DBconn() // establish connection to the database.

  constructor(email, clientKey, clientSecret) {
    this.email = email

    this.state = 0 // this.readState() ? this.readState().state : 0

    this.oauth = (this.state !== 2) ? OAuth({
      consumer: {
        key: clientKey,
        secret: clientSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64')
      }
    }) : null
  }

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
      url: this.requestTokenEndpoint,
      method: 'post',
      data: {
        oauth_callback: this.callbackUrl
      }
    }

    const raw = (await fetch(this.requestTokenEndpoint, {
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
}

module.exports = OAuthClient
