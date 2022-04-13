import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    backendUrl: "http://127.0.0.1:8000/api",
    authUrl: "http://127.0.0.1:8000/auth",
    userAuth: false,
    staffUser: false,
    id: 0,
  },
  mutations: {
    authenticated(state, value){
      state.userAuth = value;
    },
    staff_user(state, value){
      state.staffUser = value;
    },
    user_id(state,value){
      state.id = value;
    }
  },
  actions: {

  },
  modules: {

  },
  getters: {
    getServerUrl: state => {
      return state.backendUrl;
    },
    getAuthUrl: state => {
      return state.authUrl;
    },
    getUserId: state => {
      return state.id;
    },
    isUserAuth: state => {
      return state.userAuth;
    },
    isStaffUser : state => {
      return state.staffUser
    }
  }
})
