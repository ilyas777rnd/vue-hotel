<template>
  <div>
    <div class="d-flex w-100 mt-5 mb-2 justify-content-center">
      <span>Имя:&emsp;</span>
      <input type="text" class="form-control w-25" v-model="name" />
      <span class="ml-5"> Паспорт:&emsp;</span>
      <input type="text" class="form-control ml-1 w-25" v-model="passport" />
    </div>
    <StandartTable
      :items="guests"
      :fields="fields"
      @row-click="rowClickHandler"
    />
    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация о госте">
        <GuestDetail :id="this.current_id" :current_object="current_object" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import GuestDetail from "./GuestDetail.vue";
import StandartTable from "../components/StandartTable.vue";

export default {
  name: "Guests",
  components: {
    StandartTable,
    GuestDetail,
  },
  props: {
    on_modal: {
      type: Boolean,
      default: false,
    },
    booking_id: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      current_object: {},
      guests: [],
      name: "",
      passport: "",
      modal_title: "",
      current_id: 0,
      fields: [
        {
          key: "name",
          label: "Имя",
          sortable: true,
        },
        {
          key: "surname",
          label: "Фамилия",
          sortable: true,
        },
        {
          key: "pasprot_series",
          label: "Серия паспорта",
        },
        {
          key: "pasprot_number",
          label: "Номер паспорта",
        },
        {
          key: "birth_date",
          label: "Дата рождения",
          sortable: true,
        },
        {
          key: "phone",
          label: "Телефон",
        },
        {
          key: "email",
          label: "Email",
        },
      ],
    };
  },

  watch: {
    name: function (val) {
      if (this.name || this.passport) {
        this.loadData();
      } else {
        this.guests = [];
      }
    },
    passport: function (val) {
      if (this.name || this.passport) {
        this.loadData();
      } else {
        this.guests = [];
      }
    },
  },

  methods: {
    loadData() {
      this.guests = [];
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          name: this.name.toLowerCase(),
          passport: this.passport,
          //pk: "",
        },
        success: (response) => {
          this.guests = response;
        },
        error: (response) => alert("Ошибка"),
      });
    },

    async rowClickHandler(record, index) {
      if (this.booking_id == 0) {
        let current_data = {
          id: record.id,
          birth_date: record.birth_date,
        };
        this.$emit("initGuest", current_data);
      } else if (this.booking_id > 0) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/booking_add_guest/`,
          type: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth_token")}`,
          },
          data: {
            booking: this.booking_id,
            guest: record.id,
          },
          success: (response) => {
            if (response.status == "add") {
              location.reload();
            }
          },
          error: (response) => {
            alert("Ошибка");
          },
        });
      } else {
        this.current_object = JSON.parse(JSON.stringify(record));
        this.showModal();
      }
    },

    showModal() {
      this.$refs["my-modal"].show();
    },

    closeModal() {
      this.$refs["my-modal"].hide();
    },
  },
};
</script>