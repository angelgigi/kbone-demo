import Vue from 'vue'
import Router from 'vue-router'

// 路由组件懒加载
const Home = () => import(/* webpackChunkName: "Home" */'@/home/Index.vue')
const List = () => import(/* webpackChunkName: "List" */'@/list/Index.vue')
const Detail = () => import(/* webpackChunkName: "Detail" */'@/detail/Index.vue')

const Order = () => import(/* webpackChunkName: "Order" */'@/order/Index.vue')

Vue.use(Router)

export default new Router({
  // 使用 HTML5 History 模式
  mode: 'history',
  routes: [{
    // 主页路由 - 匹配 / 或 /home 或 /index
    path: '/(home|index)?',
    name: 'Home',
    component: Home,
  }, {
    // 主页 HTML 格式路由
    path: '/index.html',
    name: 'HomeHtml',
    component: Home,
  }, {
    // 测试环境主页路由
    path: '/test/(home|index)',
    name: 'HomeTest',
    component: Home,
  }, {
    // 列表页路由 - 带 ID 参数
    path: '/test/list/:id',
    name: 'List',
    component: List,
  }, {
    // 详情页路由 - 带 ID 参数
    path: '/test/detail/:id',
    name: 'Detail',
    component: Detail,
  }, {
    // 订单页路由
    path: '/test/order/index',
    name: 'Order',
    component: Order,
  }]
})
