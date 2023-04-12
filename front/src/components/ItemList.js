import './ItemList.css'

import ItemSummary from './ItemSummary'

const itemList = ({ currentSource, toggleCurrentSource, items }) => {
  const listItems = items.map((item) => 
    <ItemSummary
      key={item.key}
      item={item}
      currentSource={currentSource}
      toggleCurrentSource={toggleCurrentSource}
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

export default itemList
