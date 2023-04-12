import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const fetchCollection = async (userId, collectionKey) => {
  const response = axios.get(`${baseUrl}/api/get-collection`, {
    params: {
      userId: userId,
      collectionKey: collectionKey
    }
  })

  return response // response.data. ...
}

export default fetchCollection
