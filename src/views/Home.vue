<template>
  <div class="home">
    <h1>Morpion</h1>
    <div class="menu">
      <button @click="goToProfile">Mon Profil</button>
      <button @click="createGame">Nouvelle partie</button>
      <button @click="goToJoin">Rejoindre une partie</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProfile = () => {
  router.push('/profile')
}

const createGame = () => {
  console.log('Create game')
}

const goToJoin = () => {
  router.push('/join')
}
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
