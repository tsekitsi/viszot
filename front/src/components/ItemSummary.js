import './ItemSummary.css'

import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faBullseye } from '@fortawesome/free-solid-svg-icons'

fontawesome.library.add(faRightFromBracket, faBullseye)

const ItemSummary = ({ item, source, target, onChooseSource, onChooseTarget }) => {
  // Update action buttons' bg colors apporpriately:
  const selectedColorStyles = {
    color: 'white',
    backgroundColor: '#485fc7'
  }
  let sourceColorStyles = {}
  let targetColorStyles = {}
  if (source) {
    if (source.key === item.key) {
      sourceColorStyles = selectedColorStyles
    }
  }
  if (target) {
    if (target.key === item.key) {
      targetColorStyles = selectedColorStyles
    }
  }
  
  return (
  <li className="button is-size-7 my-li">
    <div className='blah-blah flex-col align-start'>
      <p className='has-text-weight-bold'>{item.data.title}</p>
      <p>{item.meta.creatorSummary}</p>
      <p>{item.meta.parsedDate}</p>
    </div>
    <div className='li-actions flex-row g'>
      <button
        onClick={()=>{onChooseSource(item)}}
        style={sourceColorStyles}
        title='Make Source'
        className='is-size-7 button p-1'
      >
        <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
      </button>
      <button
        onClick={()=>{onChooseTarget(item)}}
        style={targetColorStyles}
        title='Make Target'
        className='is-size-7 button p-1'
      >
        <FontAwesomeIcon icon="fa-solid fa-bullseye" />
      </button>
    </div>
  </li>
  )
}

export default ItemSummary
