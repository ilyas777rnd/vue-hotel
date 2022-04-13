<template>
  <div>
    <div class="d-flex container w-100 mt-4 mb-2 justify-content-between">
      <span>Дата начала:</span>
      <b-form-input
          class="w-50"
          id="startdate"
          v-model="start_date"
          type="date"
          placeholder="ДД-ММ-ДДДД"
          autocomplete="off"
        ></b-form-input>
    </div>
    <div class="d-flex container w-100 mt-1 mb-2 justify-content-between">
      <span> Дата окончания:</span>
      <b-form-input
          class="w-50"
          id="startdate"
          v-model="end_date"
          type="date"
          placeholder="ДД-ММ-ДДДД"
          autocomplete="off"
        ></b-form-input>
    </div>

    <div class="d-flex container w-100 mt-1 mb-2 justify-content-between">
      <span> Комната: </span>
      <b-form-select
        class="w-50"
        v-model="current_room"
        :options="rooms"
      ></b-form-select>
    </div>

    <div class="d-flex container w-100 mt-1 mb-2 justify-content-between">
      <span> Статус:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control w-50"
        v-model="status"
      />
    </div>
    <div class="d-flex container w-100 mt-1 mb-2 justify-content-between">
      <span> Всего:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control w-50"
        v-model="total"
      />
    </div>
    <div class="d-flex container w-100 mt-1 mb-2 justify-content-between">
      <span> Депозит:</span>
      <input
        type="text"
        class="form-control w-50"
        v-model="deposit"
      />
    </div>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <span> Гости:</span>
        <br />
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <span v-if="this.guests.length === 0"> СПИСОК ГОСТЕЙ ПУСТ</span>
        <ul class="list-group list-group-flush">
          <li v-for="guest in guests" :key="guest.id" class="list-group-item">
            {{ guest.name }} {{ guest.surname }} {{ guest.birth_date }}
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteGuest(id)"
            >
              Удалить гостя
            </button>
          </li>
        </ul>
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <button type="button" class="btn btn-info" @click="addGuest()">
          Добавить гостя
        </button>
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Сохранить бронь
        </button>
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <button type="button" class="btn btn-danger" @click="delBooking()">
          Удалить бронь
        </button>
      </div>
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <span>
          Сначала подтвердите текущую бронь, затем сможете добавить гостей
        </span>
      </div>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="addBooking()">
          Подтвердить бронь
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";
import datetime from "vuejs-datetimepicker";
import { mapGetters } from "vuex";

export default {
  name: "BookingDetail",
  data() {
    return {
      id: 0,
      start_date: "",
      end_date: "",
      status: "",
      total: "",
      deposit: "",
      guests: [],
      rooms: [],
      current_room: "",
      current_room_obj: {},
      update_mode: true,
    };
  },
  components: { datetime },
  created() {
    let id = window.location.href.split("/")[4];
    if (id * 1 === 0) {
      this.update_mode = false;
    } else {
      this.id = id;
      this.loadData(id);
    }
  },

  watch: {
    start_date: function (val) {
      if (this.start_date && this.end_date) {
        this.loadRooms(this.start_date, this.end_date);
      }
    },
    end_date: function (val) {
      if (this.start_date && this.end_date) {
        this.loadRooms(this.start_date, this.end_date);
      }
    },
  },

  methods: {
    ...mapGetters({
      getUserId: "getUserId",
    }),

    async loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking_detail/${id}/`,
        type: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.start_date = data.start_date;
          this.end_date = data.end_date;
          this.status = data.status;
          this.total = data.total;
          this.deposit = data.deposit;
          this.guests = data.guests;
          this.loadRooms(this.start_date, this.end_date);

          this.current_room_obj = {
            value: data.roomid,
            text: data.room,
          };
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    loadRooms(startDate, endDate) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: startDate,
          end_date: endDate,
        },
        success: (response) => {
          let data = response;
          this.rooms = data.map((element) => {
            return { value: element.id, text: element.number };
          });

          console.log(this.rooms);

          if (!$.isEmptyObject(this.current_room_obj)) {
            this.rooms.push(this.current_room_obj);
            this.current_room = this.current_room_obj.value;
          }
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update() {
      console.log(this.current_room);

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          start_date: this.start_date,
          end_date: this.end_date,
          status: this.status,
          total: this.total,
          deposit: this.deposit,
          room: this.current_room
        },
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    addBooking() {
      //console.log(this.current_room);
      //console.log(this.$store.getters.getUserId);

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking/`,
        type: "POST",
        headers: {
          //"Content-type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: this.start_date,
          end_date: this.end_date,
          status: this.status,
          total: this.total,
          deposit: this.deposit,
          room: this.current_room,
          manager: this.$store.getters.getUserId,
        },
        success: (response) => {
          this.getLastBooking();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    addGuest() {
      console.log("add_guest", this.id);
    },

    deleteGuest(id) {
      console.log("del_guest", id);
    },

    async getLastBooking() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/last_booking/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          window.location.href = `/bookingdetail/${response.id}`;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },
  },
};
</script>