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

const createGame = () => {
  console.log('Create game')
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
  padding: 25px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

button {
  padding: 15px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
