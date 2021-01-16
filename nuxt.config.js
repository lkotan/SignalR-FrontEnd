export default {
  //mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#B71C1C'
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/serviceInstaller",
    "~/helpers/vuetify",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['bootstrap-vue/nuxt', {
      icons: true,
    }],
  ],
  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'exacct',
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    friendlyErrors: false,
    extend(config, ctx) {}
  },
  axios: {
    baseURL: 'http://localhost:54099/api'
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'data.token',
          maxAge: 60 * 100,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'data.refreshToken',
          data: 'token',
          maxAge: 60 * 110
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post'
          },
          refresh: {
            url: '/auth/loginByRefreshToken',
            method: 'post'
          },
          user: {
            url: '/auth/user',
            method: 'get',
          },
          logout: {
            url: '/auth/logout',
            method: 'post'
          }
        },
      }
    },
  },
}
