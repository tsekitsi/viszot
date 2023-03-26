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
          'oauthState smallint',
          'tokenSecret text', // request token secret (oauth_token_secret)
          'accessToken text'
        ]

        this.db.run(`create table users (${fields.join(', ')})`, (err) => {
          if (!err) // table just created, creating some rows.
            this.db.run('insert into users (oauthState) values (?)', [0])
        })
      }
    })
  }

  getUser = async (userId) =>
    new Promise((resolve, reject) =>
      this.db.all('select * from users where id = (?)', [userId], (err, rows) => {
        const errMsg = (err) ? err.message :
          (rows.length < 1) ? `No user with id ${userId} found in the db!` : null;
        (errMsg) ? reject(new Error(errMsg)) : resolve(rows[0])
      })
    )
  setUser = async (userId, field, val) =>
    new Promise((resolve, reject) =>
      this.db.run(`update users set ${field} = '${val}' where id = (?)`, [userId], (err) => {
        (err) ? reject(err) : resolve(`User ${userId}'s "${field}" successfully updated to "${val}"!`)
      })
    )

  getOauthState = async (userId) => (await this.getUser(userId)).oauthState
  saveOauthState = async (userId, state) => this.setUser(userId, 'oauthState', state)
  
  getTokenSecret = async (userId) => (await this.getUser(userId)).tokenSecret
  saveTokenSecret = async (userId, secret) => this.setUser(userId, 'tokenSecret', secret)

  getAccessToken = async (userId) => (await this.getUser(userId)).accessToken
  saveAccessToken = async (userId, token) => this.setUser(userId, 'accessToken', token)

  /*
  filterBy = async (sqlWhereExpr) => new Promise((resolve, reject) =>
    this.db.all(`select * from user where ${sqlWhereExpr}`, [], (err, rows) =>
      err ? reject(err) : resolve(rows)
    )
  )

  updateBy = async (sqlWhereExpr, field, value) => new Promise((resolve, reject) =>
    this.db.run(`update user set ${field} = '${value}' where ${sqlWhereExpr}`, [], (err) =>
      err ? reject(err) : resolve('Record update successful.')
    )
  )

  run = async (sql, params, callback) => new Promise((resolve, reject) =>
    this.db.run(sql, params, (err) => {
      callback(err)
      err ? reject(err) : resolve('Db run successful.')
    })
  );
  */
}

module.exports = DBconn
