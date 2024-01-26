<template>
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
            <td></td>
          </tr>
        </tbody>
      </table>
    </va-card-content>
  </va-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        users: [],
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log(response)
          this.users = response.data.users
        } catch (error) {
          console.error('Erro ao obter usuários:', error)
        }
      },
    },
  }
</script>
