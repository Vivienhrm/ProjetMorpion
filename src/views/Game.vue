<template>
  <div class="game">
    <h1>Partie de Morpion</h1>
    <p v-if="game">ID de la partie : {{ game.id }}</p>
    <p v-if="game && game.code">Code de la partie : {{ game.code }}</p>
    <p v-if="game && !game.opponent">En attente d'un adversaire...</p>
    <p v-else-if="game && game.opponent">Adversaire : {{ game.opponent.name }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const game = ref(null)

const fetchGame = async () => {
  try {
    const response = await api.get(`/api/games/${route.params.id}`)
    game.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération de la partie:', error)
  }
}

// Fetch game on mount
fetchGame()
</script>

<style scoped>
.game {
  text-align: center;
  padding: 25px;
}
</style>
