<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Номер комнаты:</span>
      <v-select
        v-model="current_room"
        :options="rooms"
        :reduce="(item) => item.id"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Оборудование:</span>
      <v-select
        v-model="current_equipment"
        :options="equipments"
        :reduce="(item) => item.id"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Количество:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="qty"
      />
    </div>

    <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
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
        url: `${this.$store.getters.getServerUrl}/equipment_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response.data;
          this.equipments = data.map((element) => {
            return { id: element.id, label: element.attributes.name };
          });
          console.log(this.equipments);
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    loadRooms() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: '',
          end_date:'',
        },
        success: (response) => {
          let data = response.data;
          this.rooms = data.map((element) => {
            return { id: element.id, label: element.attributes.number };
          });
          console.log(this.rooms);
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    add() {
      if (this.current_room == undefined || this.current_equipment==undefined || this.qty==''){
        alert('Ошибка, введите корректные данные!');
        return;
      }

      console.log(this.current_equipment, this.current_room, this.qty);
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_list/`,
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
          window.location.href = "/equipmentlist/";
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