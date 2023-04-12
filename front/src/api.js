import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const fetchCollections = async (userId) => {
  const response = await axios.get(`https://api.zotero.org/users/7809590/collections/top`, { // `${baseUrl}/api/get-collection-items`, {
    headers: {                                          //
      Authorization: 'Bearer ###'  //  temporary!
    },                                                  //
    params: {
      userId: userId
    }
  })

  return response.data // response.data. ...
}

const fetchCollectionItems = async (userId, collectionKey) => {
  const response = await axios.get(`https://api.zotero.org/users/7809590/collections/${collectionKey}/items/top`, { // `${baseUrl}/api/get-collection-items`, {
    headers: {                                          //
      Authorization: 'Bearer ###'  //  temporary!
    },                                                  //
    params: {
      userId: userId,
      collectionKey: collectionKey
    }
  })

  return response.data // response.data. ...
}

export { fetchCollections, fetchCollectionItems }
