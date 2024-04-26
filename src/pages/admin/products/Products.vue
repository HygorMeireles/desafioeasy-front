<template>
  <tr style="color: black">
    Adicionar novo produto:
  </tr>
  <br />
  <div class="flex justify-between items-center mb-4">
    <va-input v-model="newProduct.name" placeholder="Nome" class="mr-2" />
    <va-input v-model="newProduct.ballast" placeholder="Lastro" class="mr-2" />
    <va-button style="--va-0-background-color: #f44336; color: #ffffff !important" @click="createProduct"
      >Adicionar</va-button
    >
  </div>
  <va-card class="markup-tables mb-8">
    <va-card-content class="overflow-auto">
      <va-input
        v-model.number="perPage"
        type="number"
        label="Produtos por página"
        style="color: #f44336"
        placeholder="Número de produtos por página"
        class="mr-2 mt-4 md:mt-0 md:w-1/4"
      />
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
            <th>{{ 'ID' }}</th>
            <th>{{ 'Nome' }}</th>
            <th>{{ 'Lastro' }}</th>
            <th>{{ 'Ações' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.ballast }}</td>
            <td>
              <va-button preset="plain" icon="edit" class="edit-button" @click="openModalToEditProduct(product)" />
              <va-button
                v-if="product.id !== currentProductId"
                preset="plain"
                icon="delete"
                class="delete-button ml-3"
                @click="openModalToDeleteProduct(product.id)"
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
    :model-value="editedProduct !== null"
    :title="editedProduct ? `Editar produto ${editedProduct.id} (${editedProduct.name})` : `Carregando...`"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="editProduct"
    @cancel="resetEditedProduct"
  >
    <div>
      <VaInput v-model="editedProduct.name" label="Nome" class="my-2 input-name" />
      <VaInput v-model="editedProduct.ballast" label="Lastro" class="my-2 input-lastro" />
    </div>
  </VaModal>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="deletedProduct !== null"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="deleteProduct(deletedProduct.id)"
    @cancel="resetDeletedProduct"
  >
    <div>
      <tr>
        Você tem certeza de que deseja excluir o produto
        {{
          deletedProduct.name
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
  import { ref, computed } from 'vue'

  export default {
    components: {
      MessageCard,
    },
    setup() {
      const filter = ref('')
      const filterByFields = ref([])
      const fieldsForFilter = ref(['ID', 'Nome', 'Lastro'])
      return { filter, filterByFields, fieldsForFilter }
    },
    data() {
      return {
        products: [],
        currentPage: 1,
        totalPages: 0,
        perPage: 10,
        productsPerPage: 10,
        editedProduct: null,
        deletedProduct: null,
        currentProductId: null,
        newProduct: {
          name: '',
          ballast: '',
        },
      }
    },
    computed: {
      filteredProducts() {
        return this.products.filter((product) => {
          const productInfo = {
            ...product,
            ID: product ? product.id : '',
            Nome: product ? product.name : '',
            Lastro: product ? product.ballast : '',
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
      paginatedProducts() {
        const start = (this.currentPage - 1) * this.perPage
        const end = start + this.perPage
        return this.filteredProducts.slice(start, end)
      },
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
      isNewProductDataValid() {
        return this.newProduct.name && this.newProduct.ballast && this.newProduct.product_type
      },
    },
    watch: {
      perPage(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentPage = 1
          this.fetchProducts()
        }
      },
    },
    mounted() {
      this.fetchProducts()
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await axios.get('/admin/v1/products', {
            params: { page: this.currentPage, length: this.perPage },
          })
          this.products = response.data.products
          this.totalPages = response.data.meta.total_pages
          this.currentPage = response.data.meta.page
        } catch (error) {
          this.$router.push({ path: '/erro' })
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchProducts()
      },
      async createProduct() {
        try {
          const productData = { product: this.newProduct }
          await axios.post('/admin/v1/products', productData, {})
          const successMessage = 'Produto criado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewProduct()
          this.fetchProducts()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar o produto!'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      resetNewProduct() {
        this.newProduct = { name: '', ballast: '' }
      },
      async deleteProduct(productId) {
        try {
          await axios.delete(`/admin/v1/products/${productId}`, {})
          const successMessage = 'Produto excluído com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchProducts()
          this.resetDeletedProduct()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao excluir o produto! (esse produto está presente em uma lista de cargas)'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editProduct() {
        try {
          const productId = this.editedProduct.id
          const productToUpdate = {
            name: this.editedProduct.name,
            ballast: this.editedProduct.ballast,
          }
          const currentProduct = this.products.find((product) => product.id === productId)
          if (currentProduct.name === productToUpdate.name && currentProduct.ballast === productToUpdate.ballast) {
            const errorMessage = 'Erro! Você precisa editar pelo menos um valor!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          const isDuplicate = this.products.some(
            (product) => product.id !== productId && product.name === productToUpdate.name,
          )
          if (isDuplicate) {
            const errorMessage = 'Erro! Esse produto já existe!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          await axios.put(`/admin/v1/products/${productId}`, productToUpdate, {})
          const successMessage = 'Produto editado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedProduct()
          this.fetchProducts()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar o produto!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      openModalToEditProduct(product) {
        this.editedProduct = { ...product }
      },
      openModalToDeleteProduct(productId) {
        this.deletedProduct = this.products.find((product) => product.id === productId)
      },
      resetEditedProduct() {
        this.editedProduct = null
      },
      resetDeletedProduct() {
        this.deletedProduct = null
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

  .va-input-wrapper__field input,
  .va-input-wrapper__field textarea {
    color: #f44336 !important;
  }

  .va-input-wrapper--focused {
    --va-input-wrapper-border-color: #000000;
  }

  .edit-button .va-icon {
    color: #f44336 !important;
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
</style>
