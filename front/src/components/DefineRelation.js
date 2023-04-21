import './DefineRelation.css'
import { addEdge } from '../helpers'
import { fetchCollectionItems, fetchItem } from '../api'

import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

fontawesome.library.add(faXmark)

const DefineRelation = ({ userId, items, source, activeCollection, onItemsUpdate, onSourceUpdate }) => {
  const defineNewRelation = () => {
    if (items) {
      if (items.length > 0) {
        const s = (source) ? source : items[0]
        addEdge(userId, s, null, document.querySelector('#new-rel-name').value).then(async (status) => {
          if (status === 200) {
            onItemsUpdate(await fetchCollectionItems(userId, activeCollection.key))
            if (source) onSourceUpdate(await fetchItem(userId, source.key))
            document.querySelector('.overlay').setAttribute('style', 'display:none') // close the pop-up
          }
        })
      }
    }
  }

  return (
    <div className="container">
      <div className="overlay" style={{display: 'none'}}>
        <div className="overlay-content">
          <div className="close-container">
            <button className="button close-popup" onClick={ () => document.querySelector('.overlay').setAttribute('style', 'display:none') }>
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
          </div>
          <p className="pl-4 pr-4 pb-2">Relation Name</p>
          <div className="form-container pl-4 pr-4">
            <input id="new-rel-name" className="input mr-2" type="text" placeholder="Type a new relation name..."></input>
            <button className="button" onClick={defineNewRelation}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefineRelation
