require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const sjcl = require('sjcl')
const DBconn = require('./classes/DBconn')
const OAuthClient = require('./classes/OAuthClient')

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
// oaClient.writeState('user@example.com', 1).then(result => console.log(result))
// oaClient.readState('user@example.com').then(result => console.log(result))
// oaClient.requestRequestToken().then(result => oaClient.saveRequestToken(result))
// oaClient.getRequestToken().then(result => console.log(result))

// Root endpoint:
app.get('/', (req, res) => {
  res.json({'message': 'ok'})
})

// Other endpoints:
app.get('/api/connect/:id', async (req, res) => {
  const userId = req.params.id // const { userId } = req.body
  const { oauth_verifier } = req.query
  if (oauth_verifier) { // we've been called(back) from zotero; the user has given authorization.
    // Now we need to trade oauth_verifier for access token.
    console.log('I got a oauth_verifier, for realz now.')
    //oaClient = new OAuthClient()
  } else {
    try {
      const oauthState = await db.getOauthState(userId)
      if (oauthState < 2) {
        // Get a request_token and send user off to zotero to authorize.
        oaClient = new OAuthClient(db, userId)
        const { oauth_token, oauth_token_secret } = await oaClient.requestRequestToken()
        await db.saveTokenSecret(userId, sjcl.encrypt(KEY, JSON.stringify(oauth_token_secret)))
        res.redirect(301, oaClient.makeAuthUrl(oauth_token))
      } else { // already have an access token for this user, so no need to do anything else.
        //
      }
      // res.status(200).send(`${oauthState}`)
    } catch (error) {
      res.status(404).send(error.message)
    }
  }
})

app.get('/api/users', (req, res) => {
  const sql = 'select * from user'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({'error': err.message})
      return
    }
    res.json({
      'message': 'success',
      'data': rows
    })
  })
})

app.post('/api/user/', (req, res) => { // create a new user
  let errors=[]
  if (!req.body.email) {
    errors.push('No email specified')
  }
  if (errors.length) {
    res.status(400).json({'error': errors.join(',')})
    return
  }
  const data = {
    email: req.body.email,
    oauthState: 0
  }
  const sql = 'INSERT INTO user (email, oauthState) VALUES (?,?)'
  const params = [data.email, data.oauthState]
  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({'error': err.message})
      return
    }
    res.json({
      'message': 'success',
      'data': data,
      'id' : this.lastID
    })
  })
})

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id
  const userData = req.body

  // Update the user with the given ID using the userData
  // ...

  // Return a response
  res.status(200).send(`User with ID ${userId} has been updated`)
})

// Default response for any other request:
app.use((req, res) => {
  res.status(404)
})
