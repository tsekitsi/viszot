require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const sjcl = require('sjcl')
const DBconn = require('./classes/DBconn')
const OAuthClient = require('./classes/OAuthClient')

const MY_ENCR_KEY = process.env.MY_ENCR_KEY
const OAUTH_KEY = process.env.OAUTH_KEY
const OAUTH_SECRET = process.env.OAUTH_SECRET

// Create express app:
const app = express()

// Create application/x-www-form-urlencoded parser & application/json parser:
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server port:
const PORT = 3000

// Start server:
app.listen(PORT, () => {
  console.log(`VisZot server listening on port ${PORT}...`)
})

const oaClient = new OAuthClient('user@example.com', OAUTH_KEY, OAUTH_SECRET)


// oaClient.writeState('user@example.com', 1).then(result => console.log(result))
// oaClient.readState('user@example.com').then(result => console.log(result))
// oaClient.requestRequestToken().then(result => oaClient.saveRequestToken(result))
oaClient.getRequestToken().then(result => console.log(result))


// Root endpoint:
app.get('/', (req, res) => {
  res.json({'message': 'ok'})
})

// Other endpoints:
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
  if (!req.body.token) {
    errors.push('No token specified')
  }
  if (!req.body.email) {
    errors.push('No email specified')
  }
  if (errors.length) {
    res.status(400).json({'error': errors.join(',')})
    return
  }
  const data = {
    email: req.body.email,
    token: sjcl.encrypt(MY_ENCR_KEY, req.body.token)
  }
  const sql = 'INSERT INTO user (email, token) VALUES (?,?)'
  const params = [data.email, data.token]
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

// Default response for any other request:
app.use((req, res) => {
  res.status(404)
})
