<template>
  <div class="auth-layout grid grid-cols-12 content-center">
    <div class="flex col-span-12 p-4 justify-center">
      <div class="py-5 justify-center flex" to="/">
        <easy-logo height="150" />
      </div>
    </div>

    <div class="flex justify-center col-span-12 p-4">
      <va-card class="auth-layout__card">
        <va-card-content>
          <va-tabs v-model="tabIndex" color="#000000" center>
            <template #tabs>
              <va-tab color="#a31433" name="login">{{ t('auth.login') }}</va-tab>
              <va-tab color="#a31433" name="signup">{{ t('auth.createNewAccount') }}</va-tab>
            </template>
          </va-tabs>

          <va-separator />

          <div class="p-2">
            <router-view />
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script>
  import EasyLogo from '@/components/EasyLogo.vue'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'AuthLayout',
    components: { EasyLogo },
    setup() {
      const { t } = useI18n()
      return { t }
    },
    data() {
      return {
        selectedTabIndex: 0,
      }
    },
    computed: {
      tabIndex: {
        set(tabName) {
          this.$router.push({ name: tabName })
        },
        get() {
          return this.$route.name
        },
      },
    },
  }
</script>

<style lang="scss">
  .auth-layout {
    min-height: 70vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

    &__card {
      width: 100%;
      max-width: 500px;
      max-height: 350px;
    }
  }
</style>
