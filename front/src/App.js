import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const apiBaseUrl = 'http://localhost:3001'

  const [userId, setUserId] = useState(localStorage.getItem('vzUserId'))
  const [newUserReqd, setNewUserReqd] = useState(false)
  const [oauthd, setOauthd] = useState(false)

  // This will run when the app renders for the first time:
  useEffect(() => {
    if (userId) { // if a cached user ID exists in localStorage..
      fetch(`${apiBaseUrl}/api/is-connected/${userId}`) // check if we have a key for them.
        .then(response => response.text())
        .then(data => setOauthd(parseInt(data)))
    } else if (!newUserReqd) { // else, as long as we haven't already req'd a new user created..
      // Create a new user in the DB:
      fetch(`${apiBaseUrl}/api/init-user`, {method: 'post'})
        .then(response => response.text())
        .then(data => {
          const createdId = parseInt(data)
          localStorage.setItem('vzUserId', createdId); // save the new user ID to localStorage.
          setUserId(createdId) // save user ID in piece of state.
          setNewUserReqd(true) // prevent more requests to create new user.
        });
    }
  })

  return (
    <div className="App">
      <form action="http://localhost:3001/api/connect/1">
        <button className="button">Connect to Zotero!</button>
      </form>
    </div>
  );
}

export default App;
