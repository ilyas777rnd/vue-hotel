<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Имя:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="name"
      />
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Фамилия:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="surname"
      />
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Серия паспорта:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="pasprot_series"
      />
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Номер паспорта:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="pasprot_number"
      />
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Дата рождения (ГГГГ-ММ-ДД):</span>
      <datetime
        format="YYYY-MM-DD"
        width="300px"
        v-model="birth_date"
        firstDayOfWeek="1"
      ></datetime>
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Телефон:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="phone"
      />
    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span> Email:</span>
      <input
        type="text"
        style="width: 60%"
        class="form-control"
        v-model="email"
      />
    </div>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Обновить данные гостя
        </button>
      </div>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-danger" @click="del()">
          Удалить данные гостя
        </button>
      </div>
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="addGuest()">
          Добавить гостя
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";
import datetime from "vuejs-datetimepicker";
export default {
  name: "GuestDetail",
  components: { datetime },
  props: {
    id: Number
  },
  data() {
    return {
      //id: 0,
      update_mode: true,
      name: "",
      surname: "",
      pasprot_series: "",
      pasprot_number: "",
      birth_date: "",
      phone: "",
      email: "",
    };
  },
  created() {
    //let id = window.location.href.split("/")[4];
    console.log(this.id);
    if (this.id * 1 === 0) {
      this.update_mode = false;
      return;
    }

    this.loadData(this.id);
  },
  methods: {
    loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest_detail/${id}/`,
        type: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          console.log(data);
          this.name = data.name;
          this.surname = data.surname;
          this.pasprot_series = data.pasprot_series;
          this.pasprot_number = data.pasprot_number;
          this.birth_date = data.birth_date;
          this.phone = data.phone;
          this.email = data.email;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    addGuest() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          name: this.name,
          surname: this.surname,
          pasprot_series: this.pasprot_series,
          pasprot_number: this.pasprot_number,
          birth_date: this.birth_date,
          phone: this.phone,
          email: this.email,
        },
        success: (response) => {
          window.location.href = '/guests';
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          name: this.name,
          surname: this.surname,
          pasprot_series: this.pasprot_series,
          pasprot_number: this.pasprot_number,
          birth_date: this.birth_date,
          phone: this.phone,
          email: this.email,
        },
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    del() {
      const result = confirm(`Вы точно хотите удалить гостя ${this.id} ${this.name} ${this.surname} ?`);
      if (!result) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest_remove/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
        },
        success: (response) => {
          window.location.href = '/guests';
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },
  },
};
</script>

<style>
</style>