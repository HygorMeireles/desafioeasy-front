<template>
  <tr style="color: black">
    Adicionar novo usuário:
  </tr>
  <br />
  <div class="flex justify-between items-center mb-4">
    <va-input v-model="newUser.name" placeholder="Nome" class="mr-2" />
    <va-input v-model="newUser.login" placeholder="Login" class="mr-2" />
    <va-input v-model="newUser.password" placeholder="Senha" type="password" class="mr-2" />
    <va-button style="--va-0-background-color: #f44336" @click="createUser">Adicionar</va-button>
  </div>

  <va-card class="markup-tables mb-8">
    <va-card-content class="overflow-auto">
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
          <tr v-for="user in users" :key="user.id">
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
                @click="deleteUser(user.id)"
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
    title="Editar Usuário"
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
      :disabled="users.length < usersPerPage || currentPage >= totalPages"
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

  export default {
    components: {
      MessageCard,
    },
    data() {
      return {
        users: [],
        currentPage: 1,
        totalPages: 0,
        usersPerPage: 10,
        editedUser: null,
        currentUserId: null,
        newUser: {
          name: '',
          login: '',
          password: '',
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
      isNewUserDataValid() {
        return this.newUser.name && this.newUser.login && this.newUser.password
      },
    },
    mounted() {
      this.fetchUsers()
    },
    methods: {
      async fetchUsers() {
        try {
          const token = localStorage.getItem('authToken')
          const response = await axios.get('http://localhost:3001/admin/v1/users', {
            params: { page: this.currentPage },
            headers: { Authorization: `Bearer ${token}` },
          })
          this.users = response.data.users
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Erro ao obter usuários:', error)
        }
      },
      changePage(newPage) {
        this.currentPage = newPage
        this.fetchUsers()
      },

      async createUser() {
        try {
          const token = localStorage.getItem('authToken')
          const userData = { user: this.newUser }
          await axios.post('http://localhost:3001/admin/v1/users', userData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const successMessage = 'Usuário criado com sucesso!'
          this.$store.commit('setSuccessMessage', successMessage)
          this.resetNewUser()
          this.fetchUsers()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage =
            error.response && error.response.data ? error.response.data.message : 'Erro ao criar o usuário'
          this.$store.commit('setErrorMessage', errorMessage)
          console.error('Erro ao criar usuário:', error)

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
          const token = localStorage.getItem('authToken')
          await axios.delete(`http://localhost:3001/admin/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const successMessage = 'Usuário excluído com sucesso'
          this.$store.commit('setSuccessMessage', successMessage)
          this.fetchUsers()

          setTimeout(() => {
            this.$store.commit('setSuccessMessage', '')
          }, 5000)
        } catch (error) {
          const errorMessage = 'Erro, você não pode excluir seu próprio usuário'
          this.$store.commit('setErrorMessage', errorMessage)

          setTimeout(() => {
            this.$store.commit('setErrorMessage', '')
          }, 5000)
        }
      },
      async editUser() {
        try {
          const token = localStorage.getItem('authToken')
          const userId = this.editedUser.id
          const userToUpdate = {
            name: this.editedUser.name,
            login: this.editedUser.login,
          }

          const currentUser = this.users.find((user) => user.id === userId)
          if (currentUser.name === userToUpdate.name && currentUser.login === userToUpdate.login) {
            const errorMessage = 'Erro! Você não pode editar pelo mesmo nome e login!'
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

          await axios.put(`http://localhost:3001/admin/v1/users/${userId}`, userToUpdate, {
            headers: { Authorization: `Bearer ${token}` },
          })

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
      resetEditedUser() {
        this.editedUser = null
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
</style>
