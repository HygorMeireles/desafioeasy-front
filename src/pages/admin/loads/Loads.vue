<template>
  <tr style="color: black">
    Adicionar nova carga:
  </tr>
  <br />
  <div class="flex justify-between items-center mb-4">
    <va-input v-model="newLoad.code" placeholder="Código" class="mr-2" />
    <vaDateInput v-model="newLoad.delivery_date" placeholder="Data de entrega" class="mr-2 custom-date-input" />

    <va-button style="--va-0-background-color: #f44336" @click="createLoad">Adicionar</va-button>
  </div>

  <va-card class="markup-tables mb-8">
    <va-card-content class="overflow-auto">
      <table class="va-table va-table--striped va-table--hoverable w-full">
        <thead>
          <tr>
            <th>{{ 'ID' }}</th>
            <th>{{ 'Código' }}</th>
            <th>{{ 'Data de entrega' }}</th>
            <th>{{ 'Ações' }}</th>
            <th>{{ 'Visualizar listas das cargas' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="load in loads" :key="load.id">
            <td>{{ load.id }}</td>
            <td>{{ load.code }}</td>
            <td>{{ load.delivery_date }}</td>
            <td>
              <va-button preset="plain" icon="edit" class="edit-button" @click="openModalToEditLoad(load)" />
              <va-button
                preset="plain"
                icon="delete"
                class="delete-button ml-3"
                @click="openModalToDeleteLoad(load.id)"
              />
            </td>

            <td>
              <va-button preset="plain" icon="eye" class="delete-button ml-3" @click="openConfirmation(load.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </va-card-content>
  </va-card>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="editedLoad !== null"
    title="Editar Carga"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="editLoad"
    @cancel="resetEditedLoad"
  >
    <div>
      <VaInput v-model="editedLoad.code" label="Código" class="my-2 input-code" />
      <VaDateInput v-model="editedLoad.delivery_date" label="Data de entrega" class="mr-2 custom-date-input" />
    </div>
  </VaModal>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="deletedLoad !== null"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="deleteLoad(deletedLoad.id)"
    @cancel="resetDeletedLoad"
  >
    <div>
      <tr>
        Você tem certeza de que deseja excluir a carga
        {{
          selectedLoadId
        }}?
      </tr>
    </div>
  </VaModal>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="showModal"
    size="small"
    ok-text="Sim"
    cancel-text="Não"
    @ok="confirmAction"
    @cancel="cancelAction"
  >
    <div>
      <tr>
        Você tem certeza de que deseja visualizar as listas da carga
        {{
          selectedLoadId
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

  export default {
    components: {
      MessageCard,
    },
    setup() {
      const router = useRouter()
      return { router }
    },
    data() {
      return {
        loads: [],
        currentPage: 1,
        totalPages: 0,
        loadsPerPage: 10,
        editedLoad: null,
        deletedLoad: null,
        currentLoadId: null,
        showModal: false,
        selectedLoadId: null,
        newLoad: {
          code: '',
          delivery_date: null,
        },
      }
    },
    computed: {
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
      isNewLoadDataValid() {
        return this.newLoad.code && this.newLoad.delivery_date
      },
    },
    mounted() {
      this.fetchLoads()
    },
    methods: {
      resetNewLoad() {
        this.newLoad = {
          code: '',
          delivery_date: null,
        }
      },
      async fetchLoads() {
        try {
          const response = await axios.get('/admin/v1/loads', {
            params: { page: this.currentPage },
          })
          this.loads = response.data.loads
          this.totalPages = response.data.meta.total_pages
          this.currentPage = response.data.meta.page
        } catch (error) {
          this.$router.push({ path: '/erro' })
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchLoads()
      },
      async createLoad() {
        try {
          const loadData = { load: this.newLoad }
          await axios.post('/admin/v1/loads', loadData, {})
          const successMessage = 'Carga criada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewLoad()
          this.fetchLoads()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar a carga'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async deleteLoad(loadId) {
        try {
          await axios.delete(`/admin/v1/loads/${loadId}`)
          const successMessage = 'Carga excluída com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchLoads()
          this.resetDeletedLoad()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao excluir a carga'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editLoad() {
        try {
          const loadId = this.editedLoad.id
          const loadToUpdate = {
            code: this.editedLoad.code,
            delivery_date: this.editedLoad.delivery_date,
          }
          const currentLoad = this.loads.find((load) => load.id === loadId)
          const [year, month, day] = currentLoad.delivery_date.split('-')
          const currentDeliveryDate = new Date(year, month - 1, day)
          if (
            currentLoad.code === loadToUpdate.code &&
            currentDeliveryDate.getTime() === loadToUpdate.delivery_date.getTime()
          ) {
            const errorMessage = 'Erro! Você precisa editar pelo menos um valor!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          const isDuplicate = this.loads.some((load) => load.id !== loadId && load.code === loadToUpdate.code)
          if (isDuplicate) {
            const errorMessage = 'Erro: Essa carga já existe!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          await axios.put(`/admin/v1/loads/${loadId}`, loadToUpdate, {})
          const successMessage = 'Carga editada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedLoad()
          this.fetchLoads()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar a carga!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      openConfirmation(loadId) {
        this.selectedLoadId = loadId
        this.showModal = true
      },
      confirmAction() {
        this.showModal = false

        this.$router.push({ name: 'LoadOrders', params: { loadId: this.selectedLoadId } }).catch((err) => {
          console.error(err)
        })
      },
      cancelAction() {
        this.showModal = false
        this.selectedLoadId = null
      },
      openModalToEditLoad(load) {
        const [year, month, day] = load.delivery_date.split('-')
        this.editedLoad = {
          ...load,
          delivery_date: new Date(year, month - 1, day),
        }
      },
      openModalToDeleteLoad(loadId) {
        this.selectedLoadId = loadId
        this.deletedLoad = this.loads.find((load) => load.id === loadId)
      },
      resetEditedLoad() {
        this.editedLoad = null
      },
      resetDeletedLoad() {
        this.deletedLoad = null
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

  :root {
    --va-primary: white;
  }
</style>
