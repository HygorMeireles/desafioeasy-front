<template>
  <div>
    <h1 style="color: black">Erro!</h1>
    <p style="color: black">Ocorreu um erro, seu login expirou, faça login novamente!</p>
  </div>
</template>

<script>
  import { logout } from '@/services/authService'

  export default {
    mounted() {
      setTimeout(() => {
        logout()
      }, 5000)
    },
  }
</script>
