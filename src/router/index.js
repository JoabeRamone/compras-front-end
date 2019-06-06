import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Produto from '../components/Produto'
import Categoria from '../components/Categoria'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/categorias/:id/produtos',
      name: 'Produto',
      component: Produto
    },
    {
      path: '/categorias',
      name: 'Categoria',
      component: Categoria
    }
  ]
})
