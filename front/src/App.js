import './App.css';

function App() {
  return (
    <div className="App">
      <form action="http://localhost:3001/api/connect/1">
        <button className="button">Connect to Zotero!</button>
      </form>
    </div>
  );
}

export default App;
