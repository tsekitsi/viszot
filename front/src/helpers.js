import { fetchItem, patchItem } from './api'

const calcGraph = (item, relation) => {
  let [nodes, links] = [[], []]

  if (item) {
    const sourceNode = {
      id: item.key,
      height: 1,
      size: 32,
      color: "rgb(244, 117, 96)"
    }

    nodes.push(sourceNode)
    try {
      const linkedList = JSON.parse(item.data.extra).viszot.relations

      linkedList[relation].forEach((itemKey) => {
        nodes.push({
          id: itemKey,
          height: 0,
          size: 24,
          color: "rgb(97, 205, 187)"
        })
        links.push({
          source: sourceNode.id,
          target: itemKey,
          distance: 60
        })
      })
    } catch (err) { }
  }

  return { nodes, links }
}

const extractRelations = (items) => {
  let relations = []
  if (items) {
    items.forEach((item) => {
      try { // if valid JSON..
        Object.keys(JSON.parse(item.data.extra).viszot.relations).forEach((relation) => {
          if (!(relation in relations)) {
            relations.push(relation)
          }
        })
      } catch (err) { }
    })
  }
  return [...new Set(relations)]
}

const addEdge = async (userId, source, target, relation) => {
  let extraObj = {}
  try {
    extraObj = JSON.parse(source.data.extra)
  } catch (err) { // if not json-parsable..
    // Initialize object:
    extraObj.viszot = {relations: {}}
    extraObj.other = source.data.extra
  }
  
  try {
    if (!extraObj.viszot.relations[relation]) { // if the relation is not instantiated for this item..
      if (!target) // used in the case of defining a new relation type.
        extraObj.viszot.relations[relation] = []
      else
        extraObj.viszot.relations[relation] = [target.key]
      const item = await fetchItem(userId, source.key) // get source's latest version.
      const sourceVersion = item.version
      return await patchItem(userId, source.key, sourceVersion, extraObj)
    } else if (!(target.key in extraObj.viszot.relations[relation])) {
      extraObj.viszot.relations[relation].push(target.key) // add new relation instance.
      extraObj.viszot.relations[relation] = [...new Set(extraObj.viszot.relations[relation])]
      const item = await fetchItem(userId, source.key) // get source's latest version.
      const sourceVersion = item.version
      return await patchItem(userId, source.key, sourceVersion, extraObj)
    }
  } catch (err) {
    console.log(err)
  }
}

export { calcGraph, extractRelations, addEdge }
