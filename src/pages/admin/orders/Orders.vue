<template>
  <div v-if="orders.length">
    <div v-for="order in orders" :key="order.id">{{ order.code }} - {{ order.bay }}</div>
  </div>
  <div v-else>Não foram encontradas listas para esta carga.</div>
</template>

<script>
  import axios from '@/axios'
  import { useStore } from 'vuex'
  import MessageCard from '@/components/card/MessageCard.vue'
  import moment from 'moment-timezone'
  import { useRouter } from 'vue-router'

  export default {
    props: {
      loadId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        orders: [],
      }
    },
    created() {
      this.fetchOrders()
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await axios.get(`/admin/v1/loads/${this.loadId}/orders`)
          console.log(response)
          this.orders = response.data
          console.log('Listas carregadas:', this.orders)
        } catch (error) {
          console.error('Erro ao buscar listas:', error)
        }
      },
    },
  }
</script>

<style>
  .orders-list {
    list-style: none;
    padding: 0;
  }

  .orders-list li {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
