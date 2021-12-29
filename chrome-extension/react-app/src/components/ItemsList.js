import ItemView from './ItemView'

function ItemsList({ items, seed, setSeed, renderGraph }) {  // https://youtu.be/bYFYF2GnMy8
    return (
        <div>
            {
                items.map(item => 
                    <ItemView
                        key={item.key}
                        isSeed={((seed !== null)&&(item["key"] === seed["key"])) ? true : false}
                        seed={seed}
                        setSeed={setSeed}
                        item={item}
                        renderGraph={renderGraph}
                    />
                )
            }
        </div>
    )
}

export default ItemsList
