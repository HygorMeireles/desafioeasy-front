<template>
  <tr style="color: black">
    Adicionar novo usuário:
  </tr>
  <br />
  <div class="flex justify-between items-center mb-4">
    <va-input v-model="newUser.name" placeholder="Nome" class="mr-2" />
    <va-input v-model="newUser.login" placeholder="Login" class="mr-2" />
    <va-input v-model="newUser.password" placeholder="Senha" type="password" class="mr-2" />
    <va-button style="--va-0-background-color: #f44336; color: #ffffff !important" @click="createUser"
      >Adicionar</va-button
    >
  </div>
  <va-card class="markup-tables mb-8">
    <va-card-content class="overflow-auto">
      <va-input
        v-model.number="perPage"
        type="number"
        label="Usuários por página"
        style="color: #f44336"
        placeholder="Número de usuários por página"
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
            <th>{{ 'Login' }}</th>
            <th>{{ 'Ações' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.login }}</td>
            <td>
              <va-button preset="plain" icon="edit" class="edit-button" @click="openModalToEditUser(user)" />
              <va-button
                v-if="user.id !== currentUserId"
                preset="plain"
                icon="delete"
                class="delete-button ml-3"
                @click="openModalToDeleteUser(user.id)"
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
    :model-value="editedUser !== null"
    :title="editedUser ? `Editar usuário ${editedUser.id}` : `Carregando...`"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="editUser"
    @cancel="resetEditedUser"
  >
    <div>
      <VaInput v-model="editedUser.name" label="Nome" class="my-2 input-name" />
      <VaInput v-model="editedUser.login" label="Login" class="my-2 input-login" />
    </div>
  </VaModal>

  <VaModal
    style="--va-input-wrapper-border-color: #f44336 !important"
    class="modal-crud"
    :model-value="deletedUser !== null"
    size="small"
    ok-text="Confirmar"
    cancel-text="Cancelar"
    @ok="deleteUser(deletedUser.id)"
    @cancel="resetDeletedUser"
  >
    <div>
      <tr>
        Você tem certeza de que deseja excluir o usuário
        {{
          deletedUser.id
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
      const fieldsForFilter = ref(['id', 'name', 'login'])
      return { filter, filterByFields, fieldsForFilter }
    },
    data() {
      return {
        users: [],
        currentPage: 1,
        totalPages: 0,
        perPage: 10,
        editedUser: null,
        deletedUser: null,
        currentUserId: null,
        newUser: {
          name: '',
          login: '',
          password: '',
        },
      }
    },

    computed: {
      filteredUsers() {
        return this.users.filter((user) => {
          const filterLowered = this.filter.toLowerCase()
          return (
            !this.filter ||
            Object.keys(user).some(
              (key) => this.filterByFields.includes(key) && String(user[key]).toLowerCase().includes(filterLowered),
            )
          )
        })
      },
      paginatedUsers() {
        const start = (this.currentPage - 1) * this.perPage
        const end = start + this.perPage
        return this.filteredUsers.slice(start, end)
      },
      successMessage() {
        return this.$store.state.successMessage
      },
      errorMessage() {
        return this.$store.state.errorMessage
      },
      isNewUserDataValid() {
        return this.newUser.name && this.newUser.login && this.newUser.password
      },
    },
    watch: {
      perPage(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentPage = 1
          this.fetchUsers()
        }
      },
    },
    mounted() {
      this.fetchUsers()
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get('/admin/v1/users', {
            params: { page: this.currentPage, length: this.perPage },
          })
          this.users = response.data.users
          this.totalPages = response.data.meta.total_pages
          this.currentPage = response.data.meta.page
        } catch (error) {
          this.$router.push({ path: '/erro' })
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchUsers()
      },
      async createUser() {
        try {
          const userData = { user: this.newUser }
          await axios.post('/admin/v1/users', userData, {})
          const successMessage = 'Usuário adicionado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewUser()
          this.fetchUsers()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar o usuário!'
          this.$store.commit('setErrorMessage', errorMessage)
          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      resetNewUser() {
        this.newUser = { name: '', login: '', password: '' }
      },
      async deleteUser(userId) {
        try {
          await axios.delete(`/admin/v1/users/${userId}`, {})
          const successMessage = 'Usuário excluído com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchUsers()
          this.resetDeletedUser()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro! Você não pode excluir seu próprio usuário!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editUser() {
        try {
          const userId = this.editedUser.id
          const userToUpdate = {
            name: this.editedUser.name,
            login: this.editedUser.login,
          }
          const currentUser = this.users.find((user) => user.id === userId)
          if (currentUser.name === userToUpdate.name && currentUser.login === userToUpdate.login) {
            const errorMessage = 'Erro! Você precisa editar pelo menos um valor!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          const isDuplicate = this.users.some((user) => user.id !== userId && user.login === userToUpdate.login)
          if (isDuplicate) {
            const errorMessage = 'Erro: Esse Login já existe!'
            this.$store.commit('setErrorMessage', errorMessage)
            setTimeout(() => {
              this.$store.commit('setErrorMessage', '')
            }, 5000)
            return
          }
          await axios.put(`/admin/v1/users/${userId}`, userToUpdate, {})
          const successMessage = 'Usuário editado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetEditedUser()
          this.fetchUsers()
          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro ao editar usuário!'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      openModalToEditUser(user) {
        this.editedUser = { ...user }
      },
      openModalToDeleteUser(userId) {
        this.deletedUser = this.users.find((user) => user.id === userId)
      },
      resetEditedUser() {
        this.editedUser = null
      },
      resetDeletedUser() {
        this.deletedUser = null
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
</style>
