import 'bulma/css/bulma.min.css'
import './App.css'

import { useState, useEffect } from 'react'
import CollectionSelector from './components/CollectionSelector'
import RelationSelector from './components/RelationSelector'
import ItemList from './components/ItemList'
import ItemShort from './components/ItemShort'
import Viewer from './components/Viewer'
import { addEdge, calcGraph, extractRelations } from './helpers'
import { fetchItem, fetchCollections, fetchCollectionItems } from './api'

function App() {
  const apiBaseUrl = 'http://localhost:3001'

  const [userId, setUserId] = useState(localStorage.getItem('vzUserId'))
  const [oauthd, setOauthd] = useState(false)
  const [collections, setCollections] = useState([])
  const [activeCollection, setActiveCollection] = useState(null)
  const [items, setItems] = useState([])
  const [sourceItem, setSourceItem] = useState(null) // useState(mockItems[0])
  const [targetItem, setTargetItem] = useState(null)
  const [relations, setRelations] = useState([]) // useState(['contrasts', 'extends'])
  const [activeRelation, setActiveRelation] = useState(null)
  const [canDraw, setCanDraw] = useState(false)

  let newUserReqd = false

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
          setUserId(createdId)
          localStorage.setItem('vzUserId', createdId); // save the new user ID to localStorage.
          newUserReqd = true // prevent more requests to create new user.
        });
    }
  }, [])

  // This will run when the "userId" piece of state gets updated:
  useEffect(() => {
    fetchCollections(userId).then((res) => {
      setCollections(res)
    })
  }, [oauthd])

  // This will run when the "activeCollection" piece of state gets updated:
  useEffect(() => {
    if (activeCollection) // if not null..
      fetchCollectionItems(userId, activeCollection.key).then((res) => {
        setItems(res)
        setRelations(extractRelations(res))
      })
  }, [activeCollection])

  const handleCollectionSelect = (selectedCollection) => {
    // When the user selects a collection, we update the activeCollection & relations* (*in useEffect) pieces of state
    //     and reset the sourceItem, targetItem, activeRelation, and canDraw pieces of state:
    setActiveCollection(selectedCollection)

    setSourceItem(null)
    setTargetItem(null)
    setActiveRelation(null)
    setCanDraw(false)
  }

  const handleChooseSource = (chosenSource) => {
    setSourceItem(chosenSource)
    setCanDraw(true && targetItem)
  }

  const handleChooseTarget = (chosenTarget) => {
    setTargetItem(chosenTarget)
    setCanDraw(true && sourceItem)
  }

  const handleDraw = async () =>
    addEdge(userId, sourceItem, targetItem, activeRelation).then(async (status) => {
      if (status == 200) {
        setItems(await fetchCollectionItems(userId, activeCollection.key))
        setSourceItem(await fetchItem(userId, sourceItem.key))
      }
    })

  return (
    <div className="App">
      {
        (oauthd) ?
          (
            <div id="main-app">
              <div id="left-container">
                <div id="collection-display-container" className="p-3">
                  <div id="collection-display-label-container">
                    <p>Collection</p>
                  </div>
                  <div id="collection-display-selector-container">
                    <CollectionSelector
                      collections={collections}//{mockCollections}//
                      onCollectionSelect={handleCollectionSelect}
                    />
                  </div>
                </div>
                <div id="list-display-container" className="p-3">
                  <div id="list-display-label-container">
                    <p>Items</p>
                  </div>
                  <div id="list-display-itemslist-container">
                    <ItemList
                      items={items}//{mockItems}//
                      source={sourceItem}
                      target={targetItem}
                      onChooseSource={handleChooseSource}
                      onChooseTarget={handleChooseTarget}
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
                      <ItemShort item={sourceItem} />
                    </div>
                  </div>
                  <div id="relation-display-container" className="p-3">
                    <div id="relation-display-label-container">
                      <p>Relation</p>
                    </div>
                    <div id="relation-display-selector-container">
                      <RelationSelector
                        activeRelation={activeRelation}
                        items={relations}
                        onRelationSelect={setActiveRelation}
                      />
                    </div>
                  </div>
                </div>
                <div id="viewer-container">
                  <Viewer data={calcGraph(sourceItem, activeRelation)} />
                </div>
                <div id="bottombar-container" className="ml-6 mr-6">
                  <div className="flex-row vertical-center">
                    <div id="target-display-container" className="p-3">
                      <div className="source-target-display-label-container">
                        <p>Target</p>
                      </div>
                      <div className="source-target-display-shortitemview-container">
                        <ItemShort item={targetItem} />
                      </div>
                    </div>
                    <div id="draw-display-container" className="p-3">
                      <button className="button" onClick={handleDraw} disabled={!canDraw}>Draw</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) :
          (
            <form action={`http://localhost:3001/api/connect/${userId}`}>
              <button className="button">Connect to Zotero!</button>
            </form>
          )
      }

    </div>
  );
}

export default App;
