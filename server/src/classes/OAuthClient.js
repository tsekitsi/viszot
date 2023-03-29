require('dotenv').config({ path: `${__dirname}/../.env` });
const crypto = require('')
const fetch = require('node-fetch')
const OAuth = require('oauth-1.0a')
const sjcl = require('sjcl')

const MY_ENCR_KEY = process.env.MY_ENCR_KEY
const OAUTH_KEY = process.env.OAUTH_KEY
const OAUTH_SECRET = process.env.OAUTH_SECRET

class OAuthClient {
  // Zotero OAuth endpoints:
  endpoints = {
    requestToken: 'https://www.zotero.org/oauth/request',
    authorize: 'https://www.zotero.org/oauth/authorize',
    accessToken: 'https://www.zotero.org/oauth/access'
  }

  constructor(db, userId) {
    this.db = db
    this.userId = userId

    this.oauth = OAuth({
      consumer: {
        key: OAUTH_KEY,
        secret: OAUTH_SECRET
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64')
      }
    })
  }

  // Request access token from the Zotero OAuth server:
  requestAccessToken = async (requestToken, oauthVerifier) => {
    const accessTokenConfig = {
      url: `${this.endpoints.accessToken}?oauth_token=${requestToken}`,
      method: 'post',
      data: { oauth_verifier: oauthVerifier }
    }

    const raw = (await fetch(`${this.endpoints.accessToken}?oauth_token=${requestToken}`, {
      headers: this.oauth.toHeader(this.oauth.authorize(accessTokenConfig, {
        public: requestToken,
        secret: sjcl.decrypt(MY_ENCR_KEY, await this.db.getReqTokenSecret(this.userId))
      })),
      method: 'post'
    })).text()

    const params = new URLSearchParams(await raw)

    return Object.fromEntries(params)
  }

  // Request a new request token from the Zotero OAuth server:
  requestRequestToken = async () => {
    const requestTokenConfig = {
      url: this.endpoints.requestToken,
      method: 'post'
    }

    const raw = (await fetch(this.endpoints.requestToken, {
      headers: this.oauth.toHeader(this.oauth.authorize(requestTokenConfig)),
      method: 'post'
    })).text()

    const params = new URLSearchParams(await raw)

    return Object.fromEntries(params)
  }

  // Returns the url of the Zotero authorize endpoint with the request token added as a query parameter:
  makeAuthUrl = (token) => `${this.endpoints.authorize}?oauth_token=${token}`
}

module.exports = OAuthClient
