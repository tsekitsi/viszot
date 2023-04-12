import './ItemList.css'

import ItemLi from './ItemLi'

const itemList = ({ currentSource, toggleCurrentSource, items }) => {
  const listItems = items.map((item) => 
    <ItemLi
      key={item.key}
      item={item}
      currentSource={currentSource}
      toggleCurrentSource={toggleCurrentSource}
    />
  )

  return (
    <div id="itemlist" className="p-1">
      <ul>
        { listItems }
      </ul>
    </div>
  )
}

export default itemList
