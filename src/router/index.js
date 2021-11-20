import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    alias: '/index.html',
    name: 'CharacterSaveTools',
    component: () => import('../views/CharacterSaveTools.vue'),
    meta: {
      title: '联机玩家人物编辑器',
      keywords: 'barotrauma, save editor, save, editor, submarine, decompressor',
      desc: 'Online save and submarine editing tools for Barotrauma. Edit available and owned submarines, the crew, convert between single-player and multi-player formats, adjust campaign settings. Also includes some submarine editing tools and save decompressor.',
    },
    beforeEnter: (to, from, next) => {
      // handle redirect from 404.html
      var redirect = sessionStorage.redirect
      if (redirect) {
        console.log(`Detected redirect to ${redirect}`)
        if (redirect.endsWith('/')) redirect = redirect.slice(0, -1)
        delete sessionStorage.redirect
        next(redirect)
      } else {
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory('/player-editor/'),
  routes,
})

export default router
