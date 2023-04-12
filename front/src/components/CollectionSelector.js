import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons' // https://stackoverflow.com/a/48005146
// import 'font-awesome/css/font-awesome.min.css'; // https://stackoverflow.com/a/44985218

import { useState } from 'react'

fontawesome.library.add(faAngleDown)

const CollectionSelector = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState({data: {name: 'Select a collection...'}})
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
    //console.log(event.target)
  }

  const handleItemClick = (event, clickedItem) => {
    event.preventDefault()

    // Update everything re last selected item:
    if (lastSelectedItemElement) lastSelectedItemElement.classList.remove('is-active')
    event.target.classList.add('is-active')
    setLSIE(event.target) // update last Selected Item Element
    
    // Update state:
    setSelectedItem(clickedItem)
  }

  const listItems = items.map((item) =>
    <a
      key={item.key}
      href='#'
      onClick={(event) => handleItemClick(event, item)}
      className='dropdown-item'
    >
      {item.data.name}
    </a>
  )

  return (
    <div className="dropdown"> {/*is-active*/}
      <div className="dropdown-trigger">
        <button onClick={toggleDropDownDisplay} className="button" aria-haspopup="true" aria-controls="collections-dropdown-menu">
          <span>{selectedItem.data.name}</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon="fa-solid fa-angle-down" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="collections-dropdown-menu" role="menu">
        <div className="dropdown-content">
          { // 
            listItems
          }
          {/*
          <a href='#' className="dropdown-item is-active">
            Active dropdown item
          </a>
          <a href='#' className="dropdown-item">
            Other dropdown item
          </a>
          */}
        </div>
      </div>
    </div>
  )
}

export default CollectionSelector
