<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="loginField"
      color="#000000"
      class="mb-4"
      type="login"
      :label="t('auth.login')"
      :error="!!loginErrors.length"
      :error-messages="loginErrors"
    />

    <va-input
      v-model="passwordField"
      color="#000000"
      class="mb-4"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="flex justify-center mt-2">
      <va-button
        color="#0000"
        class="my-0"
        style="
          width: 80px;
          background: linear-gradient(to right, rgb(224, 0, 7), rgb(163, 20, 51));
          height: 25px;
          margin-top: -10px;
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        "
        @click="onsubmit"
      >
        {{ t('auth.login') }}
      </va-button>
    </div>

    <div>
      <message-card v-if="successMessage" type="success" :message="successMessage" />
      <message-card v-if="errorMessage" type="error" :message="errorMessage" />
    </div>
  </form>
</template>

<script setup lang="ts">
  import axios from 'axios'
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { login } from '@/services/authService'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'

  import MessageCard from '@/components/card/MessageCard.vue'

  const router = useRouter()
  const store = useStore()
  const loginField = ref('')
  const passwordField = ref('')
  const loginErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const successMessage = ref<string>('')
  const errorMessage = ref<string>('')
  const { t } = useI18n()

  const formReady = computed(() => {
    return !(loginErrors.value.length || passwordErrors.value.length)
  })

  async function onsubmit() {
    if (!formReady.value) return

    loginErrors.value = loginField.value ? [] : ['Login é obrigatório']

    passwordErrors.value = passwordField.value.length >= 6 ? [] : ['A senha deve ter pelo menos 6 caracteres']

    if (passwordErrors.value.length > 0) {
      return
    }

    try {
      await login(loginField.value, passwordField.value)
      successMessage.value = 'Login efetuado com sucesso'
      errorMessage.value = ''
      store.commit('setSuccessMessage', successMessage.value)

      setTimeout(() => {
        successMessage.value = ''
        store.commit('setSuccessMessage', '')

        router.push({ name: 'dashboard' })
      }, 5000)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'Senha incorreta. Tente novamente.'
      } else {
        errorMessage.value = 'Erro ao realizar o login'
      }

      successMessage.value = ''
      store.commit('setErrorMessage', errorMessage.value)

      setTimeout(() => {
        errorMessage.value = ''
        store.commit('setErrorMessage', '')
      }, 5000)

      console.error('Login failed:', error)
    }
  }
</script>
