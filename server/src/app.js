require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const sjcl = require('sjcl')
const DBconn = require('./classes/DBconn')
const OAuthClient = require('./classes/OAuthClient')
const { default: api } = require('zotero-api-client');

const KEY = process.env.MY_ENCR_KEY

// Create express app:
const app = express()

// Create application/x-www-form-urlencoded parser & application/json parser:
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server port:
const PORT = 3001

// Start server:
app.listen(PORT, () => {
  console.log(`VisZot server listening on port ${PORT}...`)
})

const db = new DBconn() // connect to the db.

let oaClient // = new OAuthClient()
// db.getAccessToken(1).then(async (res) => {
//   const { oauth_token, oauth_token_secret, userID, username } = JSON.parse(sjcl.decrypt(KEY, res))
//   // console.log(oauth_token, oauth_token_secret, userID, username)
//   const apiResponse = await api(oauth_token_secret)
//                                                   .library('user', userID)
//                                                   .items()
//                                                   .get({ limit: 10 })
//   console.log(apiResponse)
// })

// Root endpoint:
app.get('/', (req, res) => {
  res.json({'message': 'ok'})
})

// Other endpoints:
app.get('/api/viszot-connect', async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query
  try {
    const userId = (await db.getUserByReqToken(oauth_token)).id
    res.redirect(`/api/connect/${userId}?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`)
  } catch (err) {
    res.status(404).send(err.message)
  }
})

app.get('/api/connect/:id', async (req, res) => {
  const userId = req.params.id // const { userId } = req.body
  const { oauth_token, oauth_verifier } = req.query
  try {
    if (oauth_verifier) { // we've been called(back) from zotero; the user has given authorization.
      oaClient = new OAuthClient(db, userId)
      const accessTokenInfo = await oaClient.requestAccessToken(oauth_token, oauth_verifier)
      //^ now we need to trade oauth_verifier for access token.
      await db.saveAccessToken(userId, sjcl.encrypt(KEY, JSON.stringify(accessTokenInfo)))
      res.status(200)
    }
    if (!(await db.getAccessToken(userId))) { // (oauthState < 2) {
      // Get a request_token and send user off to zotero to authorize.
      oaClient = new OAuthClient(db, userId)
      const { oauth_token, oauth_token_secret } = await oaClient.requestRequestToken()
      await db.saveRequestToken(userId, oauth_token)
      await db.saveReqTokenSecret(userId, sjcl.encrypt(KEY, oauth_token_secret))
      res.redirect(301, oaClient.makeAuthUrl(oauth_token))
    } /* else { // already have an access token for this user, so no need to do anything else.
      //
    }*/
  } catch (err) {
    res.status(404).send(err.message)
  }
})

// Default response for any other request:
app.use((req, res) => {
  res.status(404)
})
