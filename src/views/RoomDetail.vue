<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Номер:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="number"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Тип номера:</span>
      <b-form-select
        v-model="current_type"
        :options="types"
        style="width: 27%"
      ></b-form-select>
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Количество комнат:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="rooms_qty"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Количество спальных мест:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="sleeper_qty"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Цена в сутки:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="daily_price"
      />
    </div>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Обновить данные
        </button>
      </div>
      <!-- <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-danger" @click="del()">
          Удалить номер
        </button>
      </div> -->
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="add()">
          Добавить номер
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "RoomDetail",
  data() {
    return {
      number: 0,
      rooms_qty: 0,
      sleeper_qty: 0,
      daily_price: 0,
      types:[],
      current_type: '',
      update_mode: true,
    };
  },
  props: {
    id: Number
  },
  created() {
    this.loadTypes();
    if (this.id * 1 === 0) {
      this.update_mode = false;
      return;
    }
    this.loadData(this.id);
  },
  methods:{
    loadData(id){
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_detail/${id}/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.number = response.number;
          this.rooms_qty = response.rooms_qty;
          this.sleeper_qty = response.sleeper_qty;
          this.daily_price = response.daily_price;
          this.current_type = response.typeid;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    loadTypes(){
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.types = (data).map((element)=>{
            return {'value': element.id, 'text':element.name};
          });
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    add(){
      console.log(this.current_type);
      if (!$.isNumeric(this.current_type)){
        const elem = this.types.find(el => el.label === this.current_type);
        if (elem==undefined){
          alert("Выберите корректный тип номера!");
          return;
        }
        this.current_type = elem.id;
      }

      let current_data = {
          number: this.number,
          status: "...",
          rooms_qty: this.rooms_qty,
          sleeper_qty: this.sleeper_qty,
          daily_price: this.daily_price,
          type: this.current_type
        };

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          if (response.status == "error"){
            alert('error');
          }
          window.location.href = '/rooms';
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    // del(){
    //   const res = confirm(`Вы точно хотите удалить ${this.id} - ${this.number}?`);
    //   if (!res) {
    //     return;
    //   }

    //   $.ajax({
    //     url: `${this.$store.getters.getServerUrl}/room_remove/`,
    //     type: "POST",
    //     headers: {
    //       Authorization: `Token ${localStorage.getItem("auth_token")}`,
    //     },
    //     data: {
    //       id: this.id,
    //     },
    //     success: (response) => {
    //       window.location.href = '/rooms';
    //     },
    //     error: (response) => {
    //       alert("Ошибка");
    //     },
    //   });
    // },

    update(){
      let current_data = {
          id: this.id,
          number: this.number * 1,
          status: "AAA",
          rooms_qty: this.rooms_qty,
          sleeper_qty: this.sleeper_qty * 1,
          daily_price: this.daily_price * 1,
          type: this.current_type
      };

      console.log(current_data);

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_upd/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },
  }
};
</script>

<style>
</style>