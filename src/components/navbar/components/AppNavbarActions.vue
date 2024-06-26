<template>
  <div class="app-navbar-actions">
    <language-dropdown class="app-navbar-actions__item" />
    <profile-dropdown class="app-navbar-actions__item app-navbar-actions__item--profile">
      <span v-if="currentUser">{{ currentUser.name }}</span>
    </profile-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from '@/axios'
  import LanguageDropdown from './dropdowns/LanguageDropdown.vue'
  import ProfileDropdown from './dropdowns/ProfileDropdown.vue'

  const currentUser = ref<User | null>(null)

  interface User {
    id: number
    name: string
  }

  onMounted(async () => {
    await fetchCurrentUser()
  })

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/admin/v1/users/current')
      currentUser.value = response.data
    } catch (error) {
      console.error('Erro ao buscar o usuário atual', error)
    }
  }
</script>

<style lang="scss">
  .app-navbar-actions {
    display: flex;
    align-items: center;

    .va-dropdown__anchor {
      color: var(--va-primary);
      fill: var(--va-primary);
    }

    &__item {
      padding: 0;
      margin-left: 1.25rem;
      margin-right: 0.1rem;

      svg {
        height: 24px;
      }

      &:last-of-type {
        margin-right: 0;
      }

      &--profile {
        display: flex;
        justify-content: center;
        margin: auto 0 auto 1.25rem;
      }

      .va-dropdown-content {
        background-color: var(--va-white);
      }

      @media screen and (max-width: 640px) {
        margin-right: 0;

        &:first-of-type {
          margin-left: 0;
        }

        &--profile {
          position: absolute;
          right: 0.75rem;
          top: 1.25rem;
          height: fit-content;
          margin: auto;
        }
      }
    }
  }
</style>
