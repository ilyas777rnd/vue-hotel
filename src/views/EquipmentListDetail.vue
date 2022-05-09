<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Номер комнаты:</span>

      <b-form-select
        v-model="current_room"
        :options="rooms"
        class="w-50"
      ></b-form-select>
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Оборудование:</span>

      <b-form-select
        v-model="current_equipment"
        :options="equipments"
        class="w-50"
      ></b-form-select>
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Количество:</span>
      <input
        type="text"
        class="form-control w-50"
        v-model="qty"
      />
    </div>

    <div class="d-flex container w-100 mt-4 mb-2 justify-content-center">
      <button type="button" class="btn btn-success" @click="add()">
        Добавить оборудованиe
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "EquipmentDetail",
  data() {
    return {
      qty: "",
      rooms: [],
      current_room: "",
      equipments: [],
      current_equipment: "",
    };
  },
  created() {
    this.loadEquipment();
    this.loadRooms();
  },
  methods: {
    loadEquipment() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.equipments = data.map((element) => {
            return { value: element.id, text: element.name };
          });
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    async loadRooms() {
      console.log('aaa');
      let current_data = {
        start_date: "",
        end_date: "",
        type: "",
      };

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          let data = response;
          console.log(data);

          this.rooms = [];
          data.map((element) => {
            this.rooms.push({
              value: element.id,
              text: element.number,
              type: element.type,
              typeid: element.typeid,
              price: element.daily_price,
            });
          });

          console.log(this.rooms);
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    add() {
      if (
        this.current_room == undefined ||
        this.current_equipment == undefined ||
        this.qty == ""
      ) {
        alert("Ошибка, введите корректные данные!");
        return;
      }

      console.log(this.current_equipment, this.current_room, this.qty);
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/eq_list/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          room: this.current_room,
          enquipment: this.current_equipment,
          qty: this.qty,
        },
        success: (response) => {
          window.location.href = "/equipment/";
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