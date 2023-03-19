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
          'id INTEGER PRIMARY KEY AUTOINCREMENT',
          'email text UNIQUE',
          'requestToken text',
          'accessToken text',
          'oauthState smallint'
        ]
        const constraint = 'CONSTRAINT email_unique UNIQUE (email)'

        this.db.run(`CREATE TABLE user (${fields.join(', ')}, ${constraint})`, (err) => {
          if (!err) // table just created, creating some rows.
            this.db.run('INSERT INTO user (email, oauthState) VALUES (?,?)', ['user@example.com', 0])
        })
      }
    })
  }
  
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
}

module.exports = DBconn
