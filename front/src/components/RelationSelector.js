import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useState } from 'react'

fontawesome.library.add(faAngleDown, faPlus)

const RelationSelector = ({ activeRelation, items, onRelationSelect }) => {
  const [lastSelectedItemElement, setLSIE] = useState(null)

  const getTheDropDownElmtFromDescendant = (descendantElmt) => {
    let theDropDownElmt = null
    const limit = 10
    let counter = 0
    let currentAncestor = descendantElmt
    while (currentAncestor && (counter < limit)) {
      if (currentAncestor.classList.contains('dropdown-trigger')) {
        theDropDownElmt = currentAncestor.parentElement
        break
      } else if (currentAncestor.classList.contains('dropdown')) {
        theDropDownElmt = currentAncestor
        break
      }
      currentAncestor = currentAncestor.parentElement
      counter += 1
    }
    return theDropDownElmt
  }

  const toggleDropDownDisplay = (event) => {
    let theDropDownElmt = getTheDropDownElmtFromDescendant(event.target)
    if (theDropDownElmt) {
      event.stopPropagation()
      theDropDownElmt.classList.toggle('is-active')
    }
  }

  const handleItemClick = (event, clickedItem) => {
    event.preventDefault()

    // Send selected Collection up to the App component:
    onRelationSelect(clickedItem)

    // Update everything re last selected item:
    if (lastSelectedItemElement) lastSelectedItemElement.classList.remove('is-active')
    event.target.classList.add('is-active')
    setLSIE(event.target) // update last Selected Item Element
  }

  let listItems = (items) ? items.map((item, index) =>
    <a
      key={index}
      href='#'
      onClick={(event) => handleItemClick(event, item)}
      className='dropdown-item'
    >
      {item}
    </a>
  ) : []

  // Add the "+ New" option to create a new type of relation:
  listItems = [
    ...listItems,
    <a
      key={listItems.length}
      href='#'
      onClick={(event) => {}}
      className='dropdown-item'
    >
      <FontAwesomeIcon icon="fa-solid fa-plus" /> New
    </a>
  ]

  return (
    <div className="dropdown">
      <div className="dropdown-trigger">
        <button onClick={toggleDropDownDisplay} className="button" aria-haspopup="true" aria-controls="relations-dropdown-menu">
          <span>{(activeRelation) ? activeRelation : 'Select a relation...'}</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon="fa-solid fa-angle-down" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="relations-dropdown-menu" role="menu">
        <div className="dropdown-content">
          {listItems}
        </div>
      </div>
    </div>
  )
}

export default RelationSelector