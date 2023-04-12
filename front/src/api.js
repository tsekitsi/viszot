import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const fetchCollectionItems = async (userId, collectionKey) => {
  const response = axios.get(`${baseUrl}/api/get-collection-items`, {
    params: {
      userId: userId,
      collectionKey: collectionKey
    }
  })

  return response // response.data. ...
}

export default fetchCollectionItems
