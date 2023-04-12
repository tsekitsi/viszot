import './ItemLi.css'

const ItemLi = ({ item }) =>
  <li className="button is-size-7 my-li">
    <div className='blah-blah flex-col align-start'>
      <p className='has-text-weight-bold'>{item.data.title}</p>
      <p>{item.meta.creatorSummary}</p>
      <p>{item.meta.parsedDate}</p>
    </div>
    <div className='li-actions'>Actions</div>
  </li>

export default ItemLi
