<template>
  <form @submit.prevent="onsubmit">
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
        >{{ t('auth.login') }}</va-button
      >
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const login = ref('')
  const password = ref('')
  const keepLoggedIn = ref(false)
  const loginErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const router = useRouter()

  const formReady = computed(() => {
    return !(loginErrors.value.length || passwordErrors.value.length)
  })

  function onsubmit() {
    if (!formReady.value) return

    loginErrors.value = login.value ? [] : ['Login é obrigatório']
    passwordErrors.value = password.value ? [] : ['Password é obrigatório']

    router.push({ name: 'dashboard' })
  }
</script>
