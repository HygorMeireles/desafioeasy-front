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
                v-if="load.id !== currentLoadId"
                preset="plain"
                icon="delete"
                class="delete-button ml-3"
                @click="deleteLoad(load.id)"
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

  <div class="flex justify-center mt-4 items-center">
    <va-button
      style="--va-0-background-color: #cb0127"
      class="pagination-button"
      :disabled="currentPage <= 1"
      @click="changePage(currentPage - 1)"
    >
      &lt;
    </va-button>
    <va-button style="--va-0-background-color: #cb0127" class="pagination-number" :disabled="true">
      {{ currentPage }}
    </va-button>
    <va-button
      style="--va-0-background-color: #cb0127"
      class="pagination-button"
      :disabled="loads.length < loadsPerPage || currentPage >= totalPages"
      @click="changePage(currentPage + 1)"
    >
      &gt;
    </va-button>
  </div>
  <div>
    <message-card v-if="successMessage" type="success" :message="successMessage" />
    <message-card v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>

<script>
  import axios from 'axios'
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
        currentLoadId: null,
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
          delivery_date: new Date(),
        }
      },
      async fetchLoads() {
        try {
          const token = localStorage.getItem('authToken')
          const response = await axios.get('http://localhost:3001/admin/v1/loads', {
            params: { page: this.currentPage },
            headers: { Authorization: `Bearer ${token}` },
          })
          this.loads = response.data.loads
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Erro ao obter cargas:', error)
          this.$router.push({ path: '/erro' })
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchLoads()
      },

      async createLoad() {
        try {
          const token = localStorage.getItem('authToken')
          const loadData = { load: this.newLoad }
          await axios.post('http://localhost:3001/admin/v1/loads', loadData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const successMessage = 'Carga criada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewLoad()
          this.fetchLoads()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
          window.location.reload()
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar a carga'
          this.$store.commit('setErrorMessage', errorMessage)
          console.error('Erro ao criar a carga:', error)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async deleteLoad(loadId) {
        try {
          const token = localStorage.getItem('authToken')
          await axios.delete(`http://localhost:3001/admin/v1/loads/${loadId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const successMessage = 'Carga excluída com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchLoads()

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
          const token = localStorage.getItem('authToken')
          const loadId = this.editedLoad.id
          const loadToUpdate = {
            code: this.editedLoad.code,
            delivery_date: this.editedLoad.delivery_date,
          }

          const currentLoad = this.loads.find((load) => load.id === loadId)
          if (currentLoad.code === loadToUpdate.code && currentLoad.delivery_date === loadToUpdate.delivery_date) {
            const errorMessage = 'Erro! Você não pode editar pelo mesmo código e data de entrega!'
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

          await axios.put(`http://localhost:3001/admin/v1/loads/${loadId}`, loadToUpdate, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const successMessage = 'Carga editada com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedLoad()
          this.fetchLoads()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar a carga!(você precisa preencher com uma data de entrega)'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      openModalToEditLoad(load) {
        this.editedLoad = {
          ...load,
          delivery_date: null,
        }
      },
      resetEditedLoad() {
        this.editedLoad = null
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
