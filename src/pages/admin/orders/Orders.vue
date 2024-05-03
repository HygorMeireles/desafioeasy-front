<template>
  <va-button color="#ffffff" @click="goBack">
    <va-icon name="arrow_back" size="large" />
  </va-button>
  <br />
  <br />
  <tr style="color: black">
    Adicionar nova lista para a carga "{{
      loadCode
    }}":
  </tr>
  <br />
  <div class="flex justify-between items-center mb-4">
    <va-input v-model="newOrder.load_id" label="ID da carga" :placeholder="`${loadId}`" class="mr-2" disabled />
    <va-input v-model="newOrder.code" placeholder="Código" class="mr-2" />
    <va-input v-model="newOrder.bay" placeholder="Baia" class="mr-2" />

    <va-button style="--va-0-background-color: #f44336; color: #ffffff !important" @click="createOrder"
      >Adicionar</va-button
    >
  </div>

  <va-card class="markup-tables mb-8">
    <va-card-content class="overflow-auto">
      <va-input
        v-model.number="perPage"
        type="number"
        label="Listas por página"
        style="color: #f44336"
        placeholder="Número de listas por página"
        class="mr-2 mt-4 md:mt-0 md:w-1/3"
      />
      <va-select
        v-model="filterByFields"
        style="color: #f44336"
        placeholder="Selecione campos para filtrar"
        :options="fieldsForFilter"
        multiple
        class="mr-2 md:mt-0 md:w-1/4"
      />
      <va-input v-model="filter" placeholder="Filtrar..." class="mr-2 w-full md:w-1/4" />
      <va-button
        style="--va-0-background-color: #f44336; color: #ffffff !important"
        @click="sortAllSortedOrderProducts(loadId)"
        >Ordenar todos os produtos</va-button
      >
      <table class="va-table va-table--striped va-table--hoverable w-full">
        <thead>
          <tr>
            <th style="text-align: center; vertical-align: middle">{{ 'ID' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Código' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Baia' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Ações' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Visualizar produtos' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Visualizar produtos ordenados' }}</th>
            <th style="text-align: center; vertical-align: middle">{{ 'Ordenar produtos' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td style="text-align: center; vertical-align: middle">{{ order.id }}</td>
            <td style="text-align: center; vertical-align: middle">{{ order.code }}</td>
            <td style="text-align: center; vertical-align: middle">{{ order.bay }}</td>
            <td style="text-align: center; vertical-align: middle">
              <va-button preset="plain" icon="edit" class="edit-button" @click="openModalToEditOrder(order)" />
              <va-button
                preset="plain"
                icon="delete"
                class="delete-button ml-3"
                @click="openModalToDeleteOrder(order.id)"
              />
            </td>
            <td style="text-align: center; vertical-align: middle">
              <va-button
                preset="plain"
                icon="eye"
                class="delete-button ml-3"
                style="margin-left: -8px"
                @click="confirmAction(order.id, order.code)"
              />
            </td>
            <td style="text-align: center; vertical-align: middle">
              <va-button
                preset="plain"
                icon="eye"
                class="delete-button ml-3"
                style="margin-left: -8px"
                @click="confirmActionSorted(order.id, order.code)"
              />
            </td>
            <td style="text-align: center; vertical-align: middle">
              <va-button
                preset="plain"
                icon="loop"
                class="delete-button ml-3"
                style="margin-left: -4px"
                @click="confirmActionReSorted(order.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </va-card-content>
  </va-card>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="editedOrder !== null"
    :title="editedOrder ? `Editar lista ${editedOrder.code} da carga ${loadCode}` : `Carregando...`"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="editOrder"
    @cancel="resetEditedOrder"
  >
    <div>
      <VaInput v-model="editedOrder.code" label="Código" class="my-2 input-code" />
      <VaInput v-model="editedOrder.bay" label="Baia" class="mr-2 input-bay" />
    </div>
  </VaModal>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="deletedOrder !== null"
    size="small"
    ok-text="Sim"
    cancel-text="Não"
    @ok="deleteOrder(deletedOrder.id)"
    @cancel="resetDeletedOrder"
  >
    <div>
      <tr>
        Você tem certeza de que deseja excluir a lista
        {{
          deletedOrder.code
        }}
        da carga
        {{
          loadCode
        }}?
      </tr>
    </div>
  </VaModal>

  <div class="flex justify-center mt-4 items-center">
    <VaPagination
      v-model="currentPage"
      :pages="totalPages"
      :visible-pages="4"
      class="justify-center"
      @update:modelValue="changePage"
    />
  </div>

  <div>
    <message-card v-if="successMessage" type="success" :message="successMessage" />
    <message-card v-if="errorMessage" type="error" :message="errorMessage" />
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
      loadId: {
        type: String,
        required: true,
      },
    },
    setup() {
      const filter = ref('')
      const filterByFields = ref([])
      const fieldsForFilter = ref(['ID', 'Código', 'Baia'])
      return { filter, filterByFields, fieldsForFilter }
    },
    data() {
      return {
        orders: [],
        currentPage: 1,
        totalPages: 0,
        perPage: 10,
        ordersPerPage: 10,
        editedOrder: null,
        deletedOrder: null,
        currentOrderId: null,
        showModal: false,
        selectedOrderId: null,
        loadCode: this.$route.query.loadCode,
        newOrder: {
          code: '',
          bay: '',
          load_id: '',
        },
      }
    },
    computed: {
      filteredOrders() {
        return this.orders.filter((order) => {
          const orderInfo = {
            ...order,
            ID: order ? order.id : '',
            Código: order ? order.code : '',
            Baia: order ? order.bay : '',
          }
          const filterLowered = this.filter.toLowerCase()
          return (
            !this.filter ||
            Object.keys(orderInfo).some(
              (key) =>
                this.filterByFields.includes(key) && String(orderInfo[key]).toLowerCase().includes(filterLowered),
            )
          )
        })
      },
      paginatedOrders() {
        const start = (this.currentPage - 1) * this.perPage
        const end = start + this.perPage
        return this.filteredOrders.slice(start, end)
      },
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
    },
    watch: {
      perPage(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentPage = 1
          this.fetchOrders()
        }
      },
    },
    mounted() {
      this.fetchOrders()
      this.fetchOrderProducts()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      resetNewOrder() {
        this.newOrder = {
          code: '',
          bay: '',
          load_id: '',
        }
      },
      async fetchOrderProducts() {
        try {
          const response = await axios.get(`/admin/v1/loads/${this.loadId}/orders/${this.orderId}/order_products`, {})
          this.order_products = response.data
        } catch (error) {
          console.error('Erro ao buscar produtos da lista:', error)
        }
      },
      async fetchOrders() {
        try {
          const response = await axios.get(`/admin/v1/loads/${this.loadId}/orders`, {
            params: { page: this.currentPage, length: this.perPage },
          })
          this.orders = response.data.orders
          this.totalPages = response.data.meta.total_pages
          this.currentPage = response.data.meta.page
        } catch (error) {
          console.error('Erro ao buscar listas:', error)
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchOrders()
      },
      async sortAllSortedOrderProducts(loadId) {
        this.isLoading = true
        try {
          const response = await axios.post('/admin/v1/sorted_order_products/sort_all_products', { load_id: loadId })
          this.$store.commit('setSuccessMessage', 'Produtos ordenados com sucesso!')
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao ordenar os produtos'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        } finally {
          this.isLoading = false
        }
      },
      async createOrder() {
        this.newOrder.load_id = this.loadId.toString()
        try {
          const orderData = { order: this.newOrder }
          await axios.post(`/admin/v1/loads/${this.loadId}/orders`, orderData, {})
          const successMessage = 'Lista criada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewOrder()
          this.fetchOrders()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          console.log(this.newOrder)
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar a lista'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async deleteOrder(orderId) {
        try {
          await axios.delete(`/admin/v1/loads/${this.loadId}/orders/${orderId}`)
          const successMessage = 'Lista excluída com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchOrders()
          this.resetDeletedOrder()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao excluir a lista'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editOrder() {
        try {
          const orderId = this.editedOrder.id
          const orderToUpdate = {
            code: this.editedOrder.code,
            bay: this.editedOrder.bay,
          }
          const currentOrder = this.orders.find((order) => order.id === orderId)
          if (currentOrder.code === orderToUpdate.code && currentOrder.bay === orderToUpdate.bay) {
            const errorMessage = 'Erro! Você precisa editar pelo menos um valor!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          const isDuplicate = this.orders.some((order) => order.id !== orderId && order.code === orderToUpdate.code)
          if (isDuplicate) {
            const errorMessage = 'Erro: Essa lista já existe!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          await axios.put(`/admin/v1/loads/${this.loadId}/orders/${orderId}`, orderToUpdate, {})
          const successMessage = 'Lista editada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedOrder()
          this.fetchOrders()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar a lista!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async confirmActionReSorted(orderId) {
        try {
          const response = await axios.get(`/admin/v1/loads/${this.loadId}/orders/${orderId}/sorted_order_products`, {})
          this.sorted_order_products = response.data
          const successMessage = 'Produtos ordenados com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao ordenar os produtos'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      confirmAction(orderId, orderCode) {
        this.$router.push({ name: 'OrderProducts', params: { orderId }, query: { orderCode } }).catch((err) => {
          console.error(err)
        })
      },
      confirmActionSorted(orderId, orderCode) {
        this.$router.push({ name: 'SortedOrderProducts', params: { orderId }, query: { orderCode } }).catch((err) => {
          console.error(err)
        })
      },
      openModalToEditOrder(order) {
        this.editedOrder = {
          ...order,
        }
      },
      openModalToDeleteOrder(orderId) {
        this.selectedOrderId = orderId
        this.deletedOrder = this.orders.find((order) => order.id === orderId)
      },
      resetEditedOrder() {
        this.editedOrder = null
      },
      resetDeletedOrder() {
        this.deletedOrder = null
      },
    },
  }
</script>

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loading-text {
    margin-top: 20px;
    color: white;
    font-size: 16px;
  }

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

  :root {
    --va-primary: white;
  }

  .va-input-wrapper__label {
    color: #000000 !important;
  }

  .va-select-option--selected {
    color: #f44336 !important;
  }

  .centered-content {
    text-align: center;
    vertical-align: middle;
  }
</style>
