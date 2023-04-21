import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const fetchCollections = async (userId) => {
  const response = await axios.get(`${baseUrl}/api/users/${userId}/collections`, {
    params: {
      userId: userId
    }
  })

  return response.data
}

const fetchCollectionItems = async (userId, collectionKey) => {
  const response = await axios.get(`${baseUrl}/api/users/${userId}/collections/${collectionKey}/items`, {
    params: {
      userId: userId,
      collectionKey: collectionKey
    }
  })

  return response.data
}

const fetchItem = async (userId, itemKey) => {
  const response = await axios.get(`${baseUrl}/api/users/${userId}/items/${itemKey}`)

  return response.data
}

const patchItem = async (userId, itemKey, version, newObj) => {
  const response = await axios.patch(`${baseUrl}/api/users/${userId}/items/${itemKey}`, {
    extra: JSON.stringify(newObj)
  }, {
    headers: { 'if-unmodified-since-version': version }
  })

  return response.status
}

export { fetchCollections, fetchCollectionItems, fetchItem, patchItem }
