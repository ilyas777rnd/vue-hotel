<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Наименование:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="name"
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
          Удалить тип номера
        </button>
      </div> -->
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="add()">
          Добавить тип номера
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "RoomTypeDetail",
  data() {
    return {
      id: 0,
      name: '',
      update_mode: true,
    };
  },
  created() {
    let id = window.location.href.split("/")[4];
    if (id * 1 === 0) {
      this.update_mode = false;
      return;
    }
    this.id = id;
    this.loadData(id);
  },
  methods:{
    loadData(id){
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/${id}/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          console.log(response.data);
          this.name = response.name;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    add(){
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          name: this.name,
        },
        success: (response) => {
          window.location.href = '/roomtype';
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update(){
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          name: this.name,
        },
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