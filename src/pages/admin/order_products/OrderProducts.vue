<template>
  <div>
    <div style="color: black">Adicionar novos produtos para a lista {{ orderId }}:</div>
    <br />
    <div class="flex justify-between items-center mb-4">
      <va-input
        v-model="newOrderProduct.order_id"
        label="ID da lista"
        :placeholder="`${orderId}`"
        class="mr-2"
        disabled
      />

      <va-select
        v-model="newOrderProduct.product_id"
        label="ID do produto"
        :options="productOptions"
        :track-by="(product) => product.id"
        label-by="text"
        placeholder="Selecione o produto"
        style="color: #f44336"
        allow-create
        class="mr-2"
        @update:modelValue="updateSelectedOption"
      />

      <va-input v-model="newOrderProduct.quantity" placeholder="Quantidade" class="mr-2" />
      <div style="color: black">Caixa(s)?</div>

      <VaSwitch v-model="newOrderProduct.box" style="color: #f44336" color="#f44336" class="mr-2" />

      <va-button style="--va-0-background-color: #f44336" @click="createOrderProduct">Adicionar</va-button>
    </div>

    <va-card class="markup-tables mb-8">
      <va-card-content class="overflow-auto">
        <table class="va-table va-table--striped va-table--hoverable w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID do produto</th>
              <th>Nome do produto</th>
              <th>Quantidade</th>
              <th>Caixa(s)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order_product in order_products" :key="order_product.id">
              <td>{{ order_product.id }}</td>
              <td>{{ order_product.product_id }}</td>
              <td>{{ getProductName(order_product.product_id) }}</td>
              <td>{{ order_product.quantity }}</td>
              <td>{{ order_product.box ? 'Sim' : 'Não' }}</td>
              <td>
                <va-button
                  preset="plain"
                  icon="edit"
                  class="edit-button"
                  @click="openModalToEditOrderProduct(order_product)"
                />
                <va-button
                  preset="plain"
                  icon="delete"
                  class="delete-button ml-3"
                  @click="openModalToDeleteOrderProduct(order_product.id)"
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
      :model-value="editedOrderProduct !== null"
      :title="editedOrderProduct ? 'Editar' : 'Carregando...'"
      size="small"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      @ok="editOrderProduct"
      @cancel="resetEditedOrderProduct"
    >
      <div>
        <VaInput v-model="editedOrderProduct.quantity" label="Quantidade" class="mr-2 input-quantity" />
        <VaSwitch
          v-model="editedOrderProduct.box"
          style="color: #f44336"
          label="Caixa(s)?"
          color="#f44336"
          class="my-2 input-box"
        />
      </div>
    </VaModal>

    <VaModal
      style="--va-input-wrapper-border-color: #f44336 !important"
      class="modal-crud"
      :model-value="deletedOrderProduct !== null"
      size="small"
      ok-text="Sim"
      cancel-text="Não"
      @ok="deleteOrderProduct(deletedOrderProduct.id)"
      @cancel="resetDeletedOrderProduct"
    >
      <div>
        <div>Você tem certeza de que deseja excluir?</div>
      </div>
    </VaModal>

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

  export default {
    components: {
      MessageCard,
    },
    props: {
      orderId: {
        type: Number,
        required: true,
      },
    },
    setup() {
      const router = useRouter()
      return { router }
    },
    data() {
      return {
        order_products: [],
        products: [],
        editedOrderProduct: null,
        deletedOrderProduct: null,
        currentOrderProductId: null,
        selectedOrderProductId: null,
        newOrderProduct: {
          order_id: '',
          product_id: null,
          quantity: '',
          box: false,
        },
      }
    },
    computed: {
      productOptions() {
        return this.products.map((product) => ({
          id: product.id,
          text: product.name,
        }))
      },
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
    },
    mounted() {
      this.fetchOrderProducts()
      this.fetchProducts()
    },
    methods: {
      resetNewOrderProduct() {
        this.newOrderProduct = {
          order_id: '',
          product_id: null,
          quantity: '',
          box: false,
        }
      },
      updateSelectedOption(product) {
        this.newOrderProduct.product_id = product.id
      },
      async fetchProducts(length = 100) {
        try {
          const response = await axios.get('/admin/v1/products', {
            params: { length: length },
          })
          this.products = response.data.products
        } catch (error) {
          console.error('Erro ao buscar produtos', error)
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
      async createOrderProduct() {
        try {
          const order_productData = { order_product: this.newOrderProduct }
          await axios.post(
            `/admin/v1/loads/${this.loadId}/orders/${this.orderId}/order_products`,
            order_productData,
            {},
          )
          const successMessage = 'Produto da lista criado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewOrderProduct()
          this.fetchOrderProducts()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar o produto da lista'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async deleteOrderProduct(order_productId) {
        try {
          await axios.delete(`/admin/v1/loads/${this.loadId}/orders/${this.orderId}/order_products/${order_productId}`)
          const successMessage = 'Produto da lista excluído com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchOrderProducts()
          this.resetDeletedOrderProduct()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao excluir o produto da lista'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editOrderProduct() {
        try {
          const order_productId = this.editedOrderProduct.id
          const order_productToUpdate = {
            product_id: this.editedOrderProduct.product_id,
            quantity: this.editedOrderProduct.quantity,
            box: this.editedOrderProduct.box,
          }
          const currentOrderProduct = this.order_products.find((order_product) => order_product.id === order_productId)
          if (
            currentOrderProduct.product_id === order_productToUpdate.product_id &&
            currentOrderProduct.quantity === order_productToUpdate.quantity &&
            currentOrderProduct.box === order_productToUpdate.box
          ) {
            const errorMessage = 'Erro! Você precisa editar pelo menos um valor!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          const isDuplicate = this.order_products.some(
            (order_product) =>
              order_product.id !== order_productId && order_product.product_id === order_productToUpdate.product_id,
          )
          if (isDuplicate) {
            const errorMessage = 'Erro: Esse produto já existe na lista atual!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          await axios.put(
            `/admin/v1/loads/${this.loadId}/orders/${this.orderId}/order_products/${order_productId}`,
            order_productToUpdate,
            {},
          )
          const successMessage = 'Produto da lista editado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedOrderProduct()
          this.fetchOrderProducts()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar o produto da lista!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      openModalToEditOrderProduct(order_product) {
        this.editedOrderProduct = {
          ...order_product,
        }
      },
      openModalToDeleteOrderProduct(order_productId) {
        this.selectedOrderProductId = order_productId
        this.deletedOrderProduct = this.order_products.find((order_product) => order_product.id === order_productId)
      },
      resetEditedOrderProduct() {
        this.editedOrderProduct = null
      },
      resetDeletedOrderProduct() {
        this.deletedOrderProduct = null
      },
      getProductName(productId) {
        const product = this.products.find((product) => product.id === productId)
        return product ? product.name : 'Produto não encontrado'
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
</style>
