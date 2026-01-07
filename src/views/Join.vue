<template>
  <div class="join">
    <h1>Rejoindre une partie</h1>
    <form @submit.prevent="joinGame">
      <label for="code">Code de la partie</label>
      <input id="code" v-model="code" placeholder="Entrez le code" />
      <button type="submit" :disabled="loading">Rejoindre</button>
    </form>
    <ErrorAlert :errors="error" />
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
    }
  }
}
</script>

<style scoped>
input { display:block; margin:8px 0; padding:6px }
button { padding:6px 10px }
</style>
