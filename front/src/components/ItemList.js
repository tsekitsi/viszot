import './ItemList.css'

import { useState, useEffect } from 'react'
import ItemSummary from './ItemSummary'

const ItemList = ({ /*currentSource, toggleCurrentSource,*/ collection }) => {

  const [items, setItems] = useState([])
  const [sourceItem, setSourceItem] = useState(null)
  const [targetItem, setTargetItem] = useState(null)

  

  /*
  if (collection)
    console.log(`I'm being asked to fetch the items of collection "${collection.data.name}"!`)
  */
  
  const listItems = items.map((item) => 
    <ItemSummary
      key={item.key}
      item={item}
      /*currentSource={currentSource}
      toggleCurrentSource={toggleCurrentSource}*/
    />
  )

  return (
    <div id="itemslist" className="p-1">
      <ul>
        { listItems }
      </ul>
    </div>
  )
}

export default ItemList
