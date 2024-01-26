<template #bodyAppend>
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
            <td><!-- Ações --></td>
          </tr>
        </tbody>
      </table>
    </va-card-content>
  </va-card>

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
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        users: [],
        currentPage: 1,
        totalPages: 0,
        usersPerPage: 10,
      }
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
</style>
