<template>
  <va-button color="#ffffff" @click="goBack">
    <va-icon name="arrow_back" size="large" />
  </va-button>
  <br />
  <br />
  <div>
    <div style="color: black">Adicionar novos produtos para a lista "{{ orderCode }}":</div>
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
        v-model="selectedProduct"
        label=""
        :options="productOptions"
        :track-by="'id'"
        label-by="text"
        placeholder="Selecione o produto"
        style="color: #f44336"
        allow-create
        class="mr-2"
        @update:modelValue="updateSelectedOption"
      />
      <VaPopover class="mr-2" message="Criar um novo produto">
        <VaButton icon="add_circle_outline" color="#ffff" @click="openModalToCreateNewProduct()"></VaButton>
      </VaPopover>

      <va-input v-model="newOrderProduct.quantity" placeholder="Quantidade" class="mr-2" />
      <div style="color: black">Caixa?</div>

      <VaSwitch v-model="newOrderProduct.box" style="color: #f44336" color="#f44336" class="mr-2" />

      <va-button style="--va-0-background-color: #f44336; color: #ffffff !important" @click="createOrderProduct"
        >Adicionar</va-button
      >
    </div>

    <va-card class="markup-tables mb-8">
      <va-card-content class="overflow-auto">
        <va-select
          v-model="filterByFields"
          style="color: #f44336"
          placeholder="Selecione campos para filtrar"
          :options="fieldsForFilter"
          multiple
          class="mt-4 md:mt-0 md:w-1/2"
        />
        <va-input v-model="filter" placeholder="Filtrar..." class="mr-2 w-full md:w-1/5" />
        <table class="va-table va-table--striped va-table--hoverable w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID do produto</th>
              <th>Nome do produto</th>
              <th>Quantidade</th>
              <th>Caixa?</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order_product in filteredOrderProducts" :key="order_product.id">
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
      :title="
        editedOrderProduct ? `Editar produto ${editedOrderProduct.product_id} da lista ${orderCode}` : `Carregando...`
      "
      size="small"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      @ok="editOrderProduct"
      @cancel="resetEditedOrderProduct"
    >
      <div>
        <VaInput v-model="editedOrderProduct.quantity" label="Quantidade" class="mr-2 input-quantity" />
        <br />
        <br />
        <br />
        <div class="mr-2" style="color: black">Caixa?</div>
        <VaSwitch v-model="editedOrderProduct.box" style="color: #f44336" color="#f44336" class="my-2 input-box" />
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
        <div>
          Você tem certeza de que deseja excluir o produto {{ deletedOrderProduct.product_id }} da lista
          {{ orderCode }}?
        </div>
      </div>
    </VaModal>

    <VaModal
      style="--va-input-wrapper-border-color: #4caf50 !important"
      class="modal-crud"
      :model-value="isNewProductModalOpen"
      title="Criar Novo Produto"
      size="small"
      ok-text="Criar"
      cancel-text="Cancelar"
      @ok="submitNewProduct"
      @cancel="resetNewProductForm"
    >
      <div>
        <VaInput v-model="newProduct.name" label="Nome do Produto"></VaInput>
        <VaInput v-model="newProduct.ballast" label="Lastro"></VaInput>
        <va-select
          v-model="newProduct.product_type"
          style="color: #f44336"
          label="Tipo de Embalagem"
          class="mr-2"
          :options="packagingOptions"
        />
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
    },
    setup() {
      const filter = ref('')
      const filterByFields = ref([])
      const fieldsForFilter = ref(['IDLista', 'IDProduto', 'Nome', 'Quantidade', 'Caixa'])
      return { filter, filterByFields, fieldsForFilter }
    },
    data() {
      return {
        order_products: [],
        products: [],
        isNewProductModalOpen: false,
        newProduct: {
          name: '',
          ballast: '',
          product_type: '',
        },
        editedOrderProduct: null,
        selectedProduct: null,
        deletedOrderProduct: null,
        currentOrderProductId: null,
        selectedOrderProductId: null,
        packagingOptions: ['Plástico', 'Vidro', 'Lata'],
        orderCode: this.$route.query.orderCode,
        newOrderProduct: {
          order_id: '',
          product_id: null,
          productName: '',
          quantity: '',
          box: false,
        },
      }
    },
    computed: {
      filteredOrderProducts() {
        return this.order_products.filter((order_product) => {
          const product = this.products.find((product) => product.id === order_product.product_id)
          const productInfo = {
            ...order_product,
            IDLista: order_product ? order_product.id : '',
            Quantidade: order_product ? order_product.quantity : '',
            Caixa: order_product ? order_product.box : '',
            IDProduto: product ? product.id : '',
            Nome: product ? product.name : '',
          }
          const filterLowered = this.filter.toLowerCase()
          return (
            !this.filter ||
            Object.keys(productInfo).some(
              (key) =>
                this.filterByFields.includes(key) && String(productInfo[key]).toLowerCase().includes(filterLowered),
            )
          )
        })
      },
      productOptions() {
        return this.products.map((product) => ({
          id: product.id,
          text: `${product.name}, lastro: ${product.ballast}`,
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
      goBack() {
        this.$router.go(-1)
      },
      openModalToCreateNewProduct() {
        this.isNewProductModalOpen = true
      },
      resetNewProductForm() {
        this.newProduct = { name: '', ballast: '', product_type: '' }
        this.isNewProductModalOpen = false
      },
      async submitNewProduct() {
        try {
          await axios.post('/admin/v1/products', this.newProduct)
          const successMessage = 'Produto criado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewProductForm()
          this.fetchProducts()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar o produto'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      resetNewOrderProduct() {
        this.newOrderProduct = {
          order_id: '',
          product_id: null,
          productName: '',
          quantity: '',
          box: false,
        }
      },
      updateSelectedOption(product) {
        this.newOrderProduct.productName = product.name
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
      getProductProductType(productId) {
        const product = this.products.find((product) => product.id === productId)
        return product ? product.product_type : 'Produto não encontrado'
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
