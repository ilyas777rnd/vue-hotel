<template>
  <div>
    <div class="d-flex container w-100 mt-4 mb-2 justify-content-between">
      <button
        type="button"
        class="btn btn-success mr-2"
        @click="addBookingPage()"
      >
        Добавить бронь
      </button>

      <span class="ml-3 mr-3">Дата начала:</span>

      <b-input-group class="w-25">
        <b-form-input
          id="startdate"
          v-model="start_date"
          type="date"
          placeholder="ДД-ММ-ДДДД"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>

      <span class="ml-2 mr-3"> Дата окончания:</span>

      <b-input-group class="w-25">
        <b-form-input
          id="enddate"
          v-model="end_date"
          type="date"
          placeholder="ДД-ММ-ГГГГ"
          autocomplete="off"
        ></b-form-input>
      </b-input-group>

      <span class="ml-2 mr-3"> Тип номера:</span>

      <b-form-select
        v-model="current_type"
        :options="types"
        style="width: 27%"
      ></b-form-select>
    </div>
    <div
      class="d-flex mt-5 justify-content-center"
      style="margin-bottom: 100px; width: 97%"
    >
      <b-table
        hover
        :items="bookings"
        :fields="fields"
        @row-clicked="rowClickHandler"
      >
        <template #cell(delete)="row">
          <b-button
            size="sm"
            @click="
              deleteHandler(
                row.item.id,
                row.item.room,
                row.item.start_date,
                row.item.end_date
              )
            "
            class="mr-2 btn-danger"
          >
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon> Удалить
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import datetime from "vuejs-datetimepicker";

export default {
  name: "Booking",
  components: { datetime },
  data() {
    return {
      bookings: [],
      start_date: "",
      end_date: "",
      types: [],
      current_type: "",
      fields: [
        {
          key: "id",
          label: "Номер брони",
          sortable: true,
        },
        {
          key: "room",
          label: "Номер комнаты",
          sortable: true,
        },
        {
          key: "start_date",
          label: "Дата начала",
          sortable: true,
        },
        {
          key: "end_date",
          label: "Дата окончания",
          sortable: true,
        },
        {
          key: "deposit",
          label: "Депозит",
          sortable: true,
        },
        {
          key: "total",
          label: "Всего",
          sortable: true,
        },
        {
          key: "status",
          label: "Статус",
        },
        {
          key: "delete",
          label: "Удаление",
        },
      ],
    };
  },

  created() {
    if (!localStorage.getItem("auth_token")) {
      window.location.href = "/home";
    }
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0");
    // var yyyy = today.getFullYear();

    //today = yyyy + "-" + mm + "-" + dd;
    //console.log(today);
    this.loadTypes();
    this.loadData(`1900-01-01`, `2100-12-28`);
  },

  watch: {
    start_date: function (val) {
      if (this.checkDate(val) && this.checkDate(this.end_date)) {
        this.loadData(val, this.end_date);
      }
    },
    end_date: function (val) {
      if (this.checkDate(this.start_date) && this.checkDate(val)) {
        this.loadData(this.start_date, val);
      }
    },
  },

  methods: {
    async loadData(startDate, endDate) {
      console.log(startDate, endDate);
      if (!this.checkDate(startDate) || !this.checkDate(endDate)) {
        alert("Ошибка");
        return;
      }
      this.bookings = [];

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking_view/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: startDate,
          end_date: endDate,
          //room: 103,
        },
        success: (response) => {
          this.bookings = response;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    async loadTypes() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.types = data.map((element) => {
            return { value: element.id, text: element.name };
          });
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    rowClickHandler(record, index) {
      const route = this.$router.resolve({
        name: "bookingdetail",
        params: { id: record.id },
      });
      window.open(route.href, "_blank");
    },

    addBookingPage() {
      // const route = this.$router.resolve({
      //   name: "bookingdetail",
      //   params: { id: 0 },
      // });
      // window.open(route.href, "_blank");
      window.location.href = "/bookingdetail/0";
    },

    deleteHandler(id, room, start_date, end_date) {
      const res = confirm(`Вы точно хотите удалить бронь на ${room} комнату с ${start_date} по ${end_date} ?`);
      if (!res) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking_remove/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: id,
        },
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    checkDate(date) {
      let date_split = date.split("-");
      let y = date_split[0];
      let m = date_split[1];
      let d = date_split[2];
      try {
        var dt = new Date(y, m - 1, d, 0, 0, 0, 0);

        var mon = dt.getMonth() + 1;
        var day = dt.getDate();
        var yr = dt.getYear() + 1900;

        if (mon == m && yr == y && day == d) return true;
        else return false;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>