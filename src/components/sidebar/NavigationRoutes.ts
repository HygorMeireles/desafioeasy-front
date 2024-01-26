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
      name: 'users',
      displayName: 'users.users',
      meta: {
        icon: 'vuestic-iconset-user',
      },
      disabled: true,
    },
    {
      name: 'products',
      displayName: 'products.products',
      meta: {
        icon: 'vuestic-iconset-components',
      },
      disabled: true,
    },
    {
      name: 'loads',
      displayName: 'loads.loads',
      meta: {
        icon: 'vuestic-iconset-maps',
      },
      disabled: true,
    },
  ] as INavigationRoute[],
}
