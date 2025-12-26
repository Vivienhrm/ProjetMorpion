import axios from 'axios'

let apiKey = sessionStorage.getItem('apiKey') || null

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
  sessionStorage.setItem('apiKey', key)
}

// Initialiser la clé API depuis sessionStorage si elle existe
if (apiKey) {
  api.defaults.headers['Authorization'] = `key=${apiKey}`
}

export default api
