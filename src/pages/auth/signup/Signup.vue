<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="name"
      color="#000000"
      class="mb-4"
      type="name"
      :label="t('users.name')"
      :error="!!nameErrors.length"
      :error-messages="nameErrors"
    />

    <va-input
      v-model="login"
      color="#000000"
      class="mb-4"
      type="login"
      :label="t('auth.login')"
      :error="!!loginErrors.length"
      :error-messages="loginErrors"
    />

    <va-input
      v-model="password"
      color="#000000"
      class="mb-4"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="flex justify-center mt-4">
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
        {{ t('auth.sign_up') }}
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
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { useI18n } from 'vue-i18n'

  import MessageCard from '@/components/card/MessageCard.vue'

  const { t } = useI18n()

  const router = useRouter()
  const store = useStore()
  const name = ref('')
  const login = ref('')
  const password = ref('')

  const nameErrors = ref<string[]>([])
  const loginErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const successMessage = ref<string>('')
  const errorMessage = ref<string>('')

  const formReady = computed(() => {
    return !(nameErrors.value.length || loginErrors.value.length || passwordErrors.value.length)
  })

  async function onsubmit() {
    if (!formReady.value) return

    nameErrors.value = name.value ? [] : ['Nome é obrigatório.']
    loginErrors.value = login.value ? [] : ['Login é obrigatório.']

    passwordErrors.value = password.value.length >= 6 ? [] : ['A senha deve ter pelo menos 6 caracteres.']

    if (passwordErrors.value.length > 0) {
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        user: { name: name.value, login: login.value, password: password.value },
      })
      successMessage.value = 'Conta criada com sucesso!'
      errorMessage.value = ''
      store.commit('setSuccessMessage', successMessage.value)

      setTimeout(() => {
        successMessage.value = ''
        store.commit('setSuccessMessage', '')
        router.push({ name: 'login' })
      }, 2000)
    } catch (error) {
      errorMessage.value = 'Erro ao criar uma nova conta.'
      successMessage.value = ''
      store.commit('setErrorMessage', errorMessage.value)

      setTimeout(() => {
        errorMessage.value = ''
        store.commit('setErrorMessage', '')
      }, 5000)
    }
  }
</script>
