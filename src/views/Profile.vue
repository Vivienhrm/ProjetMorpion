<template>
  <div class="profile">
    <h1>Mon Profil</h1>
    <form v-if="user" @submit.prevent="updateProfile">
      <div>
        <label for="name">Nom :</label>
        <input id="name" v-model="user.name" type="text" required />
      </div>
      <div>
        <label for="email">Email :</label>
        <input id="email" v-model="user.email" type="email" required />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
    <ErrorAlert :errors="errors" />
    <button @click="goBack">Retour à l'accueil</button>
  </div>
</template>

<script>
import api from '@/api'
import ErrorAlert from '@/errors/ErrorAlert.vue'

export default {
  components: { ErrorAlert },
  data() {
    return {
      user: null,
      errors: []
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const response = await api.get('/api/profile')
      next(vm => vm.user = response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      next()
    }
  },
  methods: {
    async updateProfile() {
      this.errors = []
      try {
        await api.put('/api/profile', this.user)
        alert('Profil mis à jour avec succès')
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Erreur lors de la mise à jour du profil']
        }
      }
    },
    goBack() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.profile {
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
  margin-bottom: 1.5rem;
}

div {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  color: #555;
  text-align: left;
  margin-bottom: 0.5rem;
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
