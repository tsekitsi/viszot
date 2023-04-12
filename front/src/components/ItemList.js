import './ItemList.css'

// import { useState, useEffect } from 'react'
import ItemSummary from './ItemSummary'

const ItemList = ({ items, source, target, onChooseSource, onChooseTarget }) => {
  const listItems = items.map((item) => 
    <ItemSummary
      key={item.key}
      item={item}
      source={source}
      target={target}
      onChooseSource={onChooseSource}
      onChooseTarget={onChooseTarget}
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
