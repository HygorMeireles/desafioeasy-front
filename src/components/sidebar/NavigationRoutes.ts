export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'usuários',
      displayName: 'Usuários',
      meta: {
        icon: 'vuestic-iconset-user',
      },
      disabled: true,
      children: [],
    },
    {
      name: 'produtos',
      displayName: 'Produtos',
      meta: {
        icon: 'vuestic-iconset-components',
      },
      children: [],
    },
    {
      name: 'cargas',
      displayName: 'Cargas',
      meta: {
        icon: 'vuestic-iconset-maps',
      },
      disabled: true,
      children: [],
    },
  ] as INavigationRoute[],
}
