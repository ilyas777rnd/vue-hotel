<template>
  <div>
    <div
      class="d-flex w-100 mt-5 justify-content-center"
      style="margin-bottom: 220px"
    >
      <div>
        <label class="form-label">Логин</label>
        <input
          class="form-control"
          type="text"
          name="login"
          placeholder="Введите свой логин"
          v-model="login"
        />

        <label class="form-label mt-1">Пароль</label>
        <input
          class="form-control mt-1"
          type="password"
          name="password"
          placeholder="Введите пароль"
          v-model="password"
        />

        <button class="btn btn-primary mt-1 w-100" @click="authenticate()">
          Войти
        </button>
        <!-- <button class="btn btn-primary mt-1 w-100" @click="Add()">
          Add
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      login: "",
      password: "",
    };
  },
  methods: {
    ...mapMutations({
      authenticated: "authenticated"
    }),
    async authenticate() {
      $.ajax({
        url: `${this.$store.getters.getAuthUrl}/token/login/`,
        type: "POST",
        data: {
          username: this.login,
          password: this.password,
        },
        success: (response) => {
          console.log(response.data.attributes);
          alert("Вы успешно авторизовались");
          localStorage.setItem(
            "auth_token",
            response.data.attributes.auth_token
          );
          this.authenticate(true);
          window.location = "/";
        },
        error: (response) => {
          if (response.status === 400) {
            alert("Логин или пароль не верен");
          }
        },
      });

    },
    // async Add(){
    //   $.ajax({
    //     url: `${this.$store.getters.getServerUrl}/enq_type/`,
    //     type: "POST",
    //     data: {
    //       name: 'Cadabra',
    //     },
    //     success: (response) => {
    //       alert("Успешно");
    //     },
    //     error: (response) => {
    //         alert("Ошибка");
    //     },
    //   });
    // }
  },
};
</script>

<style>
</style>