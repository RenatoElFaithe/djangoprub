import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  // quitamos headers por defecto para multipart/form-data en FormData
})

export default api
