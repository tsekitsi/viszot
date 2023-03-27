const sqlite3 = require('sqlite3').verbose()

class DBconn {
  dbSrc = 'db.sqlite'

  constructor() {
    this.db = new sqlite3.Database(this.dbSrc, (err) => {
      if (err) { // problem opening database.
        console.error(err.message)
        throw err
      } else { // create & populate table, if needed.
        console.log('Connected to SQLite database...')

        const fields = [
          'id integer primary key autoincrement',
          'requestToken text', // request token (oauth_token)
          'reqTokenSecret text', // request token secret (oauth_token_secret)
          'accessToken text'
        ]

        this.db.run(`create table users (${fields.join(', ')})`, (err) => {
          if (!err) // table just created, creating some rows.
            this.db.run('insert into users (oauthState) values (?)', [0])
        })
      }
    })
  }

  getUserBy = async (field, val) =>
    new Promise((resolve, reject) =>
      this.db.all(`select * from users where ${field} = (?)`, [val], (err, rows) => {
        const errMsg = (err) ? err.message :
          (rows.length < 1) ? `No user with ${field} = "${val}" found in the db!` : null;
        (errMsg) ? reject(new Error(errMsg)) : resolve(rows[0])
      })
    )
  setUser = async (userId, field, val) =>
    new Promise((resolve, reject) =>
      this.db.run(`update users set ${field} = '${val}' where id = (?)`, [userId], (err) => {
        (err) ? reject(err) : resolve(`User ${userId}'s "${field}" successfully updated to "${val}"!`)
      })
    )
  
  getUserById = (userId) => this.getUserBy('id', userId)

  getReqTokenSecret = async (userId) => (await this.getUserById(userId)).reqTokenSecret
  saveReqTokenSecret = async (userId, secret) => this.setUser(userId, 'reqTokenSecret', secret)

  getAccessToken = async (userId) => (await this.getUserById(userId)).accessToken
  saveAccessToken = async (userId, token) => this.setUser(userId, 'accessToken', token)

  getUserByReqToken = async (token) => this.getUserBy('requestToken', token)
  saveRequestToken = async (userId, token) => this.setUser(userId, 'requestToken', token)
}

module.exports = DBconn
