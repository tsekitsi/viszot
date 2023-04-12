import './ItemsList.css'

import ItemLi from './ItemLi'

const itemsList = ({ items }) => {
  const listItems = items.map((item) => 
    <ItemLi key={item.key} item={item} />
  )

  return (
    <div id="itemslist" className="p-1">
      <ul>
        { listItems }
      </ul>
    </div>
  )
}

export default itemsList
