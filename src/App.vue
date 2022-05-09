<template>
  <div id="app">
    <div>
      <Header />
    </div>

    <div class="bv-example-row mt-1">
      <b-row class="w-99">
        <b-col md="2">
          <SideMenu v-if="this.menu_status" />
        </b-col>
        <b-col md="10">
          <div id="content">
            <router-view />
          </div>
        </b-col>
      </b-row>
    </div>

    <div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import $ from "jquery";

import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import SideMenu from "./components/SideMenu.vue";
export default {
  name: "App",
  components: {
    Header,
    SideMenu,
    Footer,
  },
  data() {
    return {
      greeting: "",
      menu_text: "Показать меню",
      menu_status: true,
    };
  },
  async beforeCreate() {
    if (localStorage.getItem("auth_token")) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/user_data/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.authenticated(true);
          this.staff_user(response.is_staff);
          this.user_id(response.user_id);
        },
        error: (response) => {
          this.notEntered();
        },
      });
    }
  },

  mounted() {
    let page = window.location.href.split("/")[3];
    this.authenticated(true);
    if (!localStorage.getItem("auth_token") && page != "login") {
      this.notEntered();
    }
  },

  methods: {
    ...mapGetters({
      isUserAuth: "isUserAuth",
    }),

    ...mapMutations({
      authenticated: "authenticated",
      staff_user: "staff_user",
      user_id: "user_id",
    }),

    notEntered() {
      this.authenticated(false);
      let content = document.getElementById("content");
      content.innerHTML =
        '<h4 class="warning">Авторизуйтесь, чтобы начать работу</h4>';
    },
  },
};
</script>

<style>
@import "assets/css/style.css";
@import "assets/css/bootstrap.css";
</style>
