import axios from 'axios'

let apiKey = null

const api = axios.create({
  baseURL: 'https://morpion-api.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Définir la clé API dynamiquement
export const setApiKey = (key) => {
  apiKey = key
  api.defaults.headers['Authorization'] = `key=${key}`
}

export default api
