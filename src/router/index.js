import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/',
    name: 'booking',
    component: () => import(/* webpackChunkName: "about" */ '../views/Booking.vue'),
  },
  {
    path: '/bookingdetail/:id',
    name: 'bookingdetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/BookingDetail.vue'),
  },

  {
    path: '/guests',
    name: 'guests',
    component: () => import(/* webpackChunkName: "about" */ '../views/Guests.vue')
  },
  {
    path: '/guestdetail/:id',
    name: 'guestdetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/GuestDetail.vue')
  },

  {
    path: '/eqptype',
    name: 'eqptype',
    component: () => import(/* webpackChunkName: "about" */ '../views/EqpType.vue')
  },
  {
    path: '/eqptypedetail/:id',
    name: 'eqptypedetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/EqpTypeDetail.vue')
  },

  {
    path: '/roomtype',
    name: 'roomtype',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoomType.vue')
  },
  {
    path: '/roomtypedetail/:id',
    name: 'roomtypedetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoomTypeDetail.vue')
  },
  {
    path: '/equipment/',
    name: 'equipment',
    component: () => import(/* webpackChunkName: "about" */ '../views/Equipment.vue')
  },
  {
    path: '/equipmentdetail/:id',
    name: 'equipmentdetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/EquipmentDetail.vue')
  },
  {
    path: '/equipmentlist/',
    name: 'equipmentlist',
    component: () => import(/* webpackChunkName: "about" */ '../views/EquipmentList.vue')
  },
  {
    path: '/equipmentlistdetail/:id',
    name: 'equipmentlistdetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/EquipmentListDetail.vue')
  },
  {
    path: '/rooms/',
    name: 'rooms',
    component: () => import(/* webpackChunkName: "about" */ '../views/Rooms.vue')
  },
  {
    path: '/roomdetail/:id',
    name: 'roomdetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoomDetail.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
