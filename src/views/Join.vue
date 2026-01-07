<template>
  <div class="join">
    <h1>Rejoindre une partie</h1>
    <form @submit.prevent="joinGame">
      <label for="code">Code de la partie</label>
      <input id="code" v-model="code" placeholder="Entrez le code" />
      <button type="submit" :disabled="loading">Rejoindre</button>
    </form>
    <ErrorAlert :errors="error" />
    <button @click="goHome" class="btn-return">Retour à l'accueil</button>
  </div>
</template>

<script>
import api from '@/api'
import ErrorAlert from '@/errors/ErrorAlert.vue'

export default {
  name: 'JoinView',
  components: { ErrorAlert },
  data() {
    return {
      code: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async joinGame() {
      if (!this.code) {
        this.error = 'Veuillez saisir un code.'
        return
      }
      this.loading = true
      this.error = null
      try {
        const res = await api.patch(`/api/games/${encodeURIComponent(this.code)}/join`)
        const data = res.data
        const id = data.id
        if (!id) {
          this.error = 'Réponse serveur invalide (id manquant).'
          return
        }
        this.$router.push(`/games/${id}`)
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Erreur réseau'
      } finally {
        this.loading = false
      }
    },
    goHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.join {
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

form {
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
  margin-top: 1rem;
}

button:hover {
  background: #1565C0;
}

button:active {
  transform: scale(0.98);
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>
