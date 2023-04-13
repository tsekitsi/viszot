require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express')
const sjcl = require('sjcl')
const DBconn = require('./classes/DBconn')
const OAuthClient = require('./classes/OAuthClient')
const { default: api } = require('zotero-api-client');
const fetch = require('node-fetch')

const KEY = process.env.MY_ENCR_KEY

// Create express app:
const app = express()

// Create application/x-www-form-urlencoded parser & application/json parser:
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: '*'
}))

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

const getZoteroUserInfo = async (userId) => {
  const accessTokenInfo = JSON.parse(sjcl.decrypt(KEY, (await db.getAccessToken(userId))))
  const zoteroUserId = accessTokenInfo['userID']
  const zoteroApiKey = accessTokenInfo['oauth_token_secret']
  return [zoteroUserId, zoteroApiKey]
}

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
    res.status(500).send(err.message)
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
      // Redirect to the VisZot frontend:
      res.redirect(301, 'http://localhost:3000') // res.status(200)
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
    res.status(500).send(err.message)
  }
})

app.get('/api/is-connected/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const bool = (await db.getAccessToken(userId)) ? 1 : 0
    res.status(200).send(`${bool}`)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get('/api/users/:id/collections', async (req, res) => {
  const userId = req.params.id
  try {
    const [zoteroUserId, zoteroApiKey] = await getZoteroUserInfo(userId)
    const data = await (await fetch(`https://api.zotero.org/users/${zoteroUserId}/collections/top`, {
      headers: {
        Authorization: `Bearer ${zoteroApiKey}`
      }
    })).json()
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get('/api/users/:id/collections/:key/items', async (req, res) => {
  const userId = req.params.id
  const collectionKey = req.params.key
  try {
    const [zoteroUserId, zoteroApiKey] = await getZoteroUserInfo(userId)
    const data = await (await fetch(`https://api.zotero.org/users/${zoteroUserId}/collections/${collectionKey}/items/top`, {
      headers: {
        Authorization: `Bearer ${zoteroApiKey}`
      }
    })).json()
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get('/api/users/:id/items/:key', async (req, res) => {
  const userId = req.params.id
  const itemKey = req.params.key
  try {
    const [zoteroUserId, zoteroApiKey] = await getZoteroUserInfo(userId)
    const data = await (await fetch(`https://api.zotero.org/users/${zoteroUserId}/items/${itemKey}`, {
      headers: {
        Authorization: `Bearer ${zoteroApiKey}`
      }
    })).json()
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.patch('/api/users/:id/items/:key', async (req, res) => {
  const userId = req.params.id
  const itemKey = req.params.key
  const version = req.headers['if-unmodified-since-version']
  try {
    const [zoteroUserId, zoteroApiKey] = await getZoteroUserInfo(userId)
    const data = await (await fetch(`https://api.zotero.org/users/${zoteroUserId}/items/${itemKey}`, { // www.zotero.org/support/dev/web_api/v3/write_requests#partial-item_updating_patch
      headers: {
        Authorization: `Bearer ${zoteroApiKey}`,
        'If-Unmodified-Since-Version': version
      },
      method: 'patch',
      body: JSON.stringify(req.body)
    })).text()
    res.status(200).send(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.post('/api/init-user', (req, res) => {
  try {
    db.initUser().then((result) => {
      res.status(200).send(`${result}`)
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// Default response for any other request:
app.use((req, res) => {
  res.status(404)
})
