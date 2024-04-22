<template>
  <va-button color="#ffffff" @click="goBack">
    <va-icon name="arrow_back" size="large" />
  </va-button>
  <br />
  <br />
  <div>
    <div style="color: black">Produtos ordenados da lista "{{ orderCode }}":</div>
    <br />
    <va-card class="markup-tables mb-8">
      <table class="va-table va-table--striped va-table--hoverable w-full">
        <thead>
          <tr>
            <th>Nome do produto</th>
            <th>Camada</th>
            <th>Quantidade</th>
            <th>Caixa</th>
            <th>Lastro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sorted_order_product in sorted_order_products" :key="sorted_order_product.id">
            <td>{{ sorted_order_product.name }}</td>
            <td>{{ sorted_order_product.layer }}</td>
            <td>{{ sorted_order_product.quantity }}</td>
            <td>{{ sorted_order_product.box ? 'Sim' : 'Não' }}</td>
            <td>{{ sorted_order_product.ballast }}</td>
          </tr>
        </tbody>
      </table>
    </va-card>

    <div>
      <message-card v-if="successMessage" type="success" :message="successMessage" />
      <message-card v-if="errorMessage" type="error" :message="errorMessage" />
    </div>
  </div>
</template>

<script>
  import axios from '@/axios'
  import { useStore } from 'vuex'
  import MessageCard from '@/components/card/MessageCard.vue'
  import moment from 'moment-timezone'
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue'

  export default {
    components: {
      MessageCard,
    },
    props: {
      orderId: {
        type: String,
        required: true,
      },
      loadId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        sorted_order_products: [],
        orderCode: this.$route.query.orderCode,
      }
    },
    computed: {
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
    },
    mounted() {
      this.fetchSortedOrderProducts()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      async fetchSortedOrderProducts() {
        try {
          const response = await axios.get(
            `/admin/v1/loads/${this.loadId}/orders/${this.orderId}/sorted_order_products`,
            {},
          )
          this.sorted_order_products = response.data
          console.log(response)
        } catch (error) {
          console.error('Erro ao buscar produtos da lista:', error)
        }
      },
    },
  }
</script>

<style>
  .pagination-button,
  .pagination-number {
    min-width: 35px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border: 1px solid #ddd !important;
    background-color: #ffffff !important;
    --va-0-background-color: #ee2955;
    color: #ffffff !important;
    margin: 0 5px;
    border-radius: 4px;
  }

  .va-input-wrapper--focused {
    --va-input-wrapper-border-color: #000000;
  }

  .va-input-wrapper__label {
    color: #000000 !important;
  }

  .va-input-wrapper__field input,
  .va-input-wrapper__field textarea {
    color: #f44336 !important;
  }

  .va-button.va-button--plain.va-button--small {
    background-color: rgb(244, 67, 54) !important;
  }

  .delete-button .va-icon {
    color: #f44336 !important;
  }

  .modal-crud .va-modal__title {
    color: #000000 !important;
  }

  .modal-crud .va-input input {
    color: #f44336 !important;
  }

  .modal-crud .va-input label {
    color: #000000 !important;
  }

  .modal-crud .va-button:first-of-type {
    background-color: #f44336 !important;
    color: white !important;
  }

  .modal-crud .va-button:nth-of-type(2) {
    --va-0-background-color: #3e8e41 !important;
    color: white !important;
  }

  .modal-crud .va-button:first-of-type:hover {
    background-color: #d32f2f !important;
  }

  .modal-crud .va-button:nth-of-type(2):hover {
    background-color: #3e8e41 !important;
  }

  .va-date-picker-cell {
    --va-1-text-color-computed: white !important;
    --va-0-bg: #f44336 !important;
  }

  .va-date-picker-cell {
    --va-0-bg: #f44336 !important;
    --va-1-text-color-computed: white !important;
  }

  .va-button--current {
    --va-0-background-color: #f44336 !important;
    color: white !important;
  }

  .va-button--normal {
    color: black !important;
  }

  .material-icons {
    color: #f44336 !important;
  }

  .va-date-picker-cell_selected {
    --va-0-bg: #f44336 !important;
  }

  .va-select-option__highlighted {
    color: #f44336 !important;
  }

  :root {
    --va-primary: white;
  }

  .va-input-wrapper__label {
    color: #000000 !important;
  }

  .va-select-option--selected {
    color: #f44336 !important;
  }

  .image-button {
    border: none;
    background: none;
    padding: 0;
  }

  .image-button img {
    width: 40px;
    height: auto;
    cursor: pointer;
  }

  .imagem-caixa {
    width: 40px;
    height: auto;
  }
</style>
