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

export { fetchCollections, fetchCollectionItems }
