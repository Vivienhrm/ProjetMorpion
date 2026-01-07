<template>
  <div class="home">
    <h1>Morpion</h1>
    <div v-if="!apiKeySet" class="api-key-form">
      <label for="apiKey">Entrez votre clé API :</label>
      <input v-model="apiKey" id="apiKey" type="text" placeholder="Votre clé API" />
      <button @click="setApiKeyHandler">Valider</button>
    </div>
    <div v-else class="menu">
      <p v-if="user">Bienvenue {{ user.name }} dans le jeu de Morpion !</p>
      <p v-else>Bienvenue dans le jeu de Morpion !</p>
      <button @click="goToProfile">Mon Profil</button>
      <button @click="createGame">Nouvelle partie</button>
      <button @click="goToJoin">Rejoindre une partie</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setApiKey } from '../api'
import api from '../api'

const router = useRouter()
const apiKey = ref('')
const apiKeySet = ref(false)
const user = ref(null)

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/api/profile')
    user.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
  }
}

const setApiKeyHandler = () => {
  if (apiKey.value.trim()) {
    setApiKey(apiKey.value.trim())
    apiKeySet.value = true
    fetchUserProfile()
  }
}

const goToProfile = () => {
  router.push('/profile')
}

const createGame = async () => {
  try {
    const response = await api.post('/api/games', {})
    const gameId = response.data.id
    router.push(`/games/${gameId}`)
  } catch (error) {
    console.error('Erreur lors de la création de la partie:', error)
  }
}

const goToJoin = () => {
  router.push('/join')
}

onMounted(() => {
  const storedApiKey = sessionStorage.getItem('apiKey')
  if (storedApiKey) {
    apiKeySet.value = true
    fetchUserProfile()
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.api-key-form, .menu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

label {
  font-weight: bold;
  color: #555;
  text-align: left;
  margin-bottom: 0.5rem;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box; 
}

input:focus {
  border-color: #0277bd;
  outline: none;
}

button {
  background: #0277bd;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

button:hover {
  background: #1565C0;
}

button:active {
  transform: scale(0.98);
}
</style>
