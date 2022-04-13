<template>
  <div id="app">
    <Header />

    <div class="grid-container">
      <div>
        <SideMenu v-if="this.menu_status" />
      </div>

      <div>
        <router-view />
      </div>
    </div>

    <Footer />

  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

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
  created() {
    if (!localStorage.getItem("auth_token")) {
      console.log("Пользователь не вошел");
      this.authenticated(false);
      console.log(this.$store.getters.isUserAuth);
      window.location.href = '/home';
    } else {
      this.authenticated(true);
      console.log(this.$store.getters.isUserAuth);

      fetch(`${this.$store.getters.getServerUrl}/user_data/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
      })
        .then((responce) => responce.json())
        .then((responce) => {
          console.log(responce);
          this.staff_user(responce.is_staff);
          this.user_id(responce.user_id);
        });
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
  },
};
</script>

<style>
@import "assets/css/style.css";
@import "assets/css/bootstrap.css";
</style>
