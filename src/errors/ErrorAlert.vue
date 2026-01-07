<template>
  <div v-if="hasErrors" class="error-alert">
    <div v-if="Array.isArray(errors)">
      <p v-for="(err, index) in errors" :key="index">{{ err }}</p>
    </div>
    <div v-else>
      <p>{{ errors }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    errors: {
      type: [String, Array],
      default: null
    }
  },
  computed: {
    hasErrors() {
      if (!this.errors) return false
      if (Array.isArray(this.errors)) return this.errors.length > 0
      return this.errors.length > 0
    }
  }
}
</script>

<style scoped>
.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
}
.error-alert p {
  margin: 5px 0;
}
</style>
