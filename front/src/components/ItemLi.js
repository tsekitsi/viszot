import './ItemLi.css'

import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faBullseye } from '@fortawesome/free-solid-svg-icons'

fontawesome.library.add(faRightFromBracket, faBullseye)

const ItemLi = ({ currentSource, toggleCurrentSource, item }) => {
  let colorStyles = {}
  if (currentSource) {
    if (currentSource.key == item.key) {
      colorStyles = {
        color: 'white',
        backgroundColor: '#485fc7'
      }
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
        onClick={(item)=>{toggleCurrentSource(item)}}
        style={colorStyles}
        title='Make Source'
        className='is-size-7 button p-1'
      >
        <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
      </button>
      <button onClick={()=>{}} title='Make Target' className='is-size-7 button p-1'>
        <FontAwesomeIcon icon="fa-solid fa-bullseye" />
      </button>
    </div>
  </li>
  )
}

export default ItemLi
