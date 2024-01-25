<template>
  <va-sidebar
    :width="width"
    :minimized="minimized"
    :minimized-width="minimizedWidth"
    :animated="animated"
    style="background-color: #c9012d"
  >
    <menu-minimized v-if="minimized" :items="items" />
    <menu-accordion v-else :items="items" />
  </va-sidebar>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import NavigationRoutes from './NavigationRoutes'
  import MenuAccordion from './menu/MenuAccordion.vue'
  import MenuMinimized from './menu/MenuMinimized.vue'
  interface SidebarProps {
    width: string
    minimized: boolean
    minimizedWidth: string
    animated: boolean
  }

  const props = defineProps<SidebarProps>()

  const items = ref(NavigationRoutes.routes)
</script>

<style lang="scss">
  .va-sidebar {
    &__menu {
      padding: 2rem 0;
    }

    &-item {
      &__icon {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
