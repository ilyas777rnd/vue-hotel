<template>
  <div>
    <div
      class="
        bv-example-row bv-example-row-flex-cols
        mt-3
        d-flex
        justify-content-center
      "
    >
      <b-row align-v="stretch">
        <b-col md="4" lg="3">
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
          <b-button variant="outline-primary" @click="addBookingPage()">
            Добавить бронь
          </b-button>
        </b-col>

        <b-col md="4" lg="2">
          <span>Дата начала:</span>

          <b-input-group>
            <b-form-input
              id="startdate"
              v-model="start_date"
              type="date"
              placeholder="ДД-ММ-ДДДД"
              autocomplete="off"
            ></b-form-input>
          </b-input-group>
        </b-col>

        <b-col md="4" lg="2">
          <span> Дата окончания:</span>

          <b-input-group>
            <b-form-input
              id="enddate"
              v-model="end_date"
              type="date"
              placeholder="ДД-ММ-ГГГГ"
              autocomplete="off"
            ></b-form-input>
          </b-input-group>
        </b-col>

        <b-col md="4" lg="2"
          ><span> Тип номера:</span>

          <b-form-select
            v-model="current_type"
            :options="types"
          ></b-form-select>
        </b-col>

        <b-col md="4" lg="2">
          <span> Номер комнаты:</span>

          <b-form-select v-model="current_room" :options="rooms"></b-form-select
        ></b-col>

        <b-col md="2" lg="1">
          <div @click="downloadReport()">
            <b-icon
              class="mt-4 ml-2"
              id="downloadIcon"
              icon="download"
              aria-hidden="true"
            ></b-icon>
          </div>
        </b-col>
      </b-row>
    </div>
    <StandartTable
      :items="bookings"
      :fields="fields"
      @row-click="rowClickHandler"
      @delete="deleteHandler"
    />
  </div>
</template>

<script>
import $ from "jquery";
import StandartTable from "../components/StandartTable.vue";

export default {
  name: "Booking",
  components: {
    StandartTable,
  },
  data() {
    return {
      bookings: [],
      rooms: [],
      current_room: "",
      start_date: "",
      end_date: "",
      types: [],
      current_type: "",
      delete: false,
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
          label: "",
        },

        {
          key: "delete",
          label: "",
        },
      ],
    };
  },

  mounted() {
    if (!this.$store.getters.isUserAuth) {
      return;
    }

    this.loadTypes();
    this.loadRooms();
  },

  watch: {
    start_date: function (val) {
      this.loadData();
    },

    end_date: function (val) {
      this.loadData();
    },

    current_type: function (val) {
      this.loadData();
      this.loadRooms();
    },

    current_room: function (val) {
      this.loadData();
    },
  },

  methods: {
    async downloadReport() {
      console.log("aaa");
    },

    async loadData() {
      let current_data = {
        start_date: this.start_date,
        end_date: this.end_date,
        room_type: this.current_type,
        room_number: this.current_room,
      };

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          this.bookings = response;
          // const url = window.URL.createObjectURL(new Blob([response.data]));
          // const link = document.createElement("a");
          // link.href = url;
          // link.setAttribute("download", "file.xlsx");
          // document.body.appendChild(link);
          // link.click();
        },
        error: (response) => alert("Ошибка"),
      });
    },

    async loadTypes() {
      if (!this.$store.getters.isUserAuth) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.types = [];
          this.types.push({ value: null, text: "Все типы" });
          data.map((element) => {
            this.types.push({ value: element.id, text: element.name });
          });
          this.current_type = null;
        },
        // error: (response) => {
        //   alert("Ошибка");
        // },
      });
    },

    async loadRooms() {
      if (!this.$store.getters.isUserAuth) {
        return;
      }

      let current_data = {
        start_date: "",
        end_date: "",
      };

      if ($.isNumeric(this.current_type)) {
        current_data["type"] = this.current_type;
      } else {
        current_data["type"] = 0;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          let data = response;

          this.rooms = [];
          this.rooms.push({ value: null, text: "Все номера" });
          data.map((element) => {
            this.rooms.push({
              value: element.id,
              text: element.number,
              type: element.type,
              typeid: element.typeid,
              price: element.daily_price,
            });
          });

          this.current_room = null;
        },
        // error: (response) => {
        //   alert("Ошибка");
        // },
      });
    },

    rowClickHandler(record) {
      window.location.href = `/bookingdetail/${record.id}`;
    },

    addBookingPage() {
      window.location.href = "/bookingdetail/0";
    },

    deleteHandler(temp) {
      const res = confirm(
        `Вы точно хотите удалить бронь на ${temp.item.room} комнату с ${temp.item.start_date} по ${temp.item.end_date} ?`
      );
      if (res) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/booking/`,
          type: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth_token")}`,
          },
          data: {
            id: temp.item.id,
          },
          success: (response) => {
            location.reload();
          },
          // error: (response) => {
          //   //alert("Ошибка");
          // },
        });
      }
    },
  },
};
</script>