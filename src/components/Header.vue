<template>
  <div>
    <div id="header">
      <div class="d-flex justify-content-between">
        <div class="logo">
          HotelManager
        </div>
        <nav class="header-nav">

          <a
            href="/login"
            v-if="!this.$store.getters.isUserAuth"
            role="button"
            class="btn link mr-5"
            >Войти</a
          >

          <a href="#" id="logout" v-else @click="Logout()" role="button" class="btn link mr-2"
            ><b-icon icon="power"></b-icon> Выйти</a
          >
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Header",
  methods: {
    ...mapGetters({
      isUserAuth: "isUserAuth",
    }),
    ...mapMutations({
      authenticated: "authenticated",
      staff_user: "staff_user",
      user_id: "user_id",
    }),
    goLogin() {
      this.$router.push({ name: "login" });
    },
    Logout() {
      localStorage.removeItem("auth_token");
      this.staff_user(false);
      this.user_id(0);
      this.authenticated(false);
      window.location("/");
    },
  },
};
</script>

<style>
</style>