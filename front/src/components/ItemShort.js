const ItemShort = ({ item }) => {
  if (item) {
    return (
      <div className='blah-blah btn-like flex-row align-ctr'>
        <>
          <p className='has-text-weight-bold w-8r blah-blah'>{item.data.title}</p>
          <p className='blah-blah'>, {item.meta.creatorSummary} </p>
          <p className='blah-blah'>, {(new Date(item.meta.parsedDate)).getFullYear()}</p>
        </>
      </div>
    )
  } else {
    return (
      <div className='blah-blah btn-like flex-row align-ctr'>
        <p>None selected...</p>
      </div>
    )
  }
  
}

export default ItemShort
