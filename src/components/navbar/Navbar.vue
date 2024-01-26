<template>
  <va-navbar
    class="app-layout-navbar"
    style="background-color: #ee2955; color: rgb(255, 255, 255); fill: rgb(255, 255, 255)"
  >
    <template #left>
      <div class="left">
        <va-icon-menu-collapsed
          :class="{ 'x-flip': !isSidebarMinimized }"
          class="va-navbar__item"
          color="white"
          @click="$emit('toggle-sidebar')"
        />
        <img src="/logo.png" alt="Logo easy" width="75" />
      </div>
    </template>
    <div class="app-navbar-center"></div>
    <template #right>
      <app-navbar-actions class="app-navbar__actions" :user-name="$store.state.userName" />
    </template>
  </va-navbar>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import EasyLogo from '@/components/EasyLogo.vue'
  import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
  import AppNavbarActions from './components/AppNavbarActions.vue'

  const store = useStore()
  const { t } = useI18n()

  const isSidebarMinimized = computed(() => store.state.isSidebarMinimized)

  const { getColors } = useColors()
  const colors = getColors()

  const toggleSidebar = () => {
    store.commit('toggleSidebar')
    isSidebarMinimized.value = store.state.isSidebarMinimized
  }

  // Defina a variável isFullScreenSidebar
  const isFullScreenSidebar = computed(() => {
    return window.innerWidth <= 640 && !isSidebarMinimized.value
  })
</script>

<style lang="scss" scoped>
  .va-navbar {
    box-shadow: var(--va-box-shadow);
    z-index: 2;
    height: 0.5vh; /* Alterado para usar unidades de viewport */
    display: flex;
    justify-content: space-between;
    align-items: center;
    .va-icon-menu-collapsed {
      width: 20px; /* Ajuste o tamanho conforme necessário */
      height: 20px; /* Ajuste o tamanho conforme necessário */
    }
  }

  .left {
    display: flex;
    align-items: center;

    & > * {
      margin-right: 0.5rem;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }

  .x-flip {
    transform: scaleX(-100%);
  }

  .app-navbar-center {
    display: flex;
    align-items: center;
    height: 1rem;

    @media screen and (max-width: 950px) {
      &__text {
        display: none;
      }
    }
  }
</style>
