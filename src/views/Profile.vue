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
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

div {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}
</style>
