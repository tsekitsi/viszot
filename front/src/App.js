import 'bulma/css/bulma.min.css'
import './App.css'

import { useState, useEffect } from 'react'
import CollectionSelector from './components/CollectionSelector'
import RelationSelector from './components/RelationSelector'
import ItemList from './components/ItemList'
import ShortItemLi from './components/ShortItemLi'
import fetchCollection from './api'

function App() {
  const apiBaseUrl = 'http://localhost:3001'

  const [userId, setUserId] = useState(localStorage.getItem('vzUserId'))
  const [newUserReqd, setNewUserReqd] = useState(false)
  const [oauthd, setOauthd] = useState(false)
  
  const [sourceItem, setSourceItem] = useState(null)

  // This will run when the app renders for the first time:
  useEffect(() => {
    if (userId) { // if a cached user ID exists in localStorage..
      fetch(`${apiBaseUrl}/api/is-connected/${userId}`) // check if we have a key for them.
        .then(response => response.text())
        .then(data => setOauthd(parseInt(data)))
    } else if (!newUserReqd) { // else, as long as we haven't already req'd a new user created..
      // Create a new user in the DB:
      fetch(`${apiBaseUrl}/api/init-user`, { method: 'post' })
        .then(response => response.text())
        .then(data => {
          const createdId = parseInt(data)
          localStorage.setItem('vzUserId', createdId); // save the new user ID to localStorage.
          setUserId(createdId) // save user ID in piece of state.
          setNewUserReqd(true) // prevent more requests to create new user.
        });
    }
  }, [])

  const mockData = {
    collections: [
      { key: 'P9WXVCSP', data: { name: '453-project' } },
      { key: 'TJSB7TNF', data: { name: 'Sample Collection #1' } },
      { key: 'XPAH7RNJ', data: { name: 'Misc' } },
      { key: 'UA4QEZT6', data: { name: 'COMS311-textbooks' } }
    ],
    items: [
      { key: 'Z3HTS2DH', meta: {creatorSummary: 'Byrne et al.', parsedDate: '2019-02-01'}, data: { title: 'Implementing Dust Shielding as a Criteria for Star Formation' } },
      { key: 'A5NXBNNP', meta: {creatorSummary: 'Warren et al.', parsedDate: '1982-12-01'}, data: { title: 'A Prospective Microbiologic Study of Bacteriuria in Patients with Chronic Indwelling Urethral Catheters' } },
      { key: 'BS28WK72', meta: {creatorSummary: 'Thompson et al.', parsedDate: '1994-11-11'}, data: { title: 'CLUSTAL W: improving the sensitivity of progressive multiple sequence alignment through sequence weighting, position-specific gap penalties and weight matrix choice' } },
      { key: 'RE3FW5NY', meta: {creatorSummary: 'Himpsl et al.', parsedDate: 'Unknown'}, data: { title: 'Identification of virulence determinants in uropathogenic Proteus mirabilis using signature-tagged mutagenesis' } },
      { key: 'PIE2XAPA', meta: {creatorSummary: 'De Maayer et al.', parsedDate: '2011-11-24'}, data: { title: 'Comparative genomics of the type VI secretion systems of Pantoea and Erwinia species reveals the presence of putative effector islands that may be translocated by the VgrG and Hcp proteins' } },
      { key: 'YQDSXXAE', meta: {creatorSummary: 'Pukatzki et al.', parsedDate: '2007-09-25'}, data: { title: 'Type VI secretion system translocates a phage tail spike-like protein into target cells where it cross-links actin' } },
      { key: 'JZQ222EJ', meta: {creatorSummary: 'Pukatzki et al.', parsedDate: '2006-01-31'}, data: { title: 'Identification of a conserved bacterial protein secretion system in Vibrio cholerae using the Dictyostelium host model system' } },
      { key: 'PDBWNUA3', meta: {creatorSummary: 'Basler and Mekalanos', parsedDate: '2012-08-17'}, data: { title: 'Type 6 Secretion Dynamics Within and Between Bacterial Cells' } },
      { key: '85WB7P48', meta: {creatorSummary: 'Alteri et al.', parsedDate: '2013-09-05'}, data: { title: 'Multicellular Bacteria Deploy the Type VI Secretion System to Preemptively Strike Neighboring Cells' } }
    ],
    source: null,
    relations: ['cites', 'extends', 'contradicts'],
    target: null
  }

  return (
    <div className="App">
      {
        (true) ? // (oauthd) ?
          (
            <div id="main-app">
              <div id="left-container">
                <div id="collection-display-container" className="p-3">
                  <div id="collection-display-label-container">
                    <p>Collection</p>
                  </div>
                  <div id="collection-display-selector-container">
                    <CollectionSelector items={mockData.collections} />
                  </div>
                </div>
                <div id="list-display-container" className="p-3">
                  <div id="list-display-label-container">
                    <p>Items</p>
                  </div>
                  <div id="list-display-itemslist-container">
                    <ItemList
                      currentSource={sourceItem}
                      toggleCurrentSource={setSourceItem}
                      items={mockData.items}
                    />
                  </div>
                </div>
              </div>
              <div id="right-container">
                <div id="topbar-container">
                  <div id="source-display-container" className="p-3">
                    <div id="source-display-label-container">
                      <p>Source</p>
                    </div>
                    <div id="source-display-shortitemview-container">
                      {/*<ShortItemLi item={sourceItem}/>*/}
                    </div>
                  </div>
                  <div id="relation-display-container" className="p-3">
                    <div id="relation-display-label-container">
                      <p>Relation</p>
                    </div>
                    <div id="relation-display-selector-container">
                      <RelationSelector items={mockData.relations} />
                    </div>
                  </div>
                </div>
                <div id="viewer-container">

                </div>
                <div id="bottombar-container" className="ml-6 mr-6">
                  <div className="flex-row vertical-center">
                    <div id="target-display-container" className="p-3">
                      <div className="source-target-display-label-container">
                        <p>Target</p>
                      </div>
                      <div className="source-target-display-shortitemview-container">
                        short item view...
                      </div>
                    </div>
                    <div id="draw-display-container" className="p-3">
                    <button className="button">Draw</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) :
          (
            <form action="http://localhost:3001/api/connect/1">
              <button className="button">Connect to Zotero!</button>
            </form>
          )
      }

    </div>
  );
}

export default App;
