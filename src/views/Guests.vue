<template>
  <div>
    <div class="d-flex container w-50 mt-5 mb-2 justify-content-center">
      <span>Имя:</span>
      <input type="text" class="form-control ml-1 w-50" v-model="name" />
      <span class="ml-5"> Паспорт:</span>
      <input type="text" class="form-control ml-1 w-50" v-model="passport" />
      <!-- <span class="ml-5"> Фамилия:</span>
      <input type="text" class="form-control ml-1 w-50" v-model="surname" /> -->
    </div>
    <div class="d-flex container w-100 mt-5 justify-content-center">
      <b-table
        hover
        :items="found_guests"
        :fields="fields"
        @row-clicked="rowClickHandler"
      >
        <!-- <template #cell(delete)="row">
          <b-button
            size="sm"
            @click="deleteHandler(row.item.id, row.item.name)"
            class="mr-2 btn-danger"
          >
            Удалить
          </b-button>
        </template> -->
      </b-table>
    </div>
    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация о госте">
        <GuestDetail :id="this.current_id" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import GuestDetail from './GuestDetail.vue';

export default {
  name: "Guests",
  components: {
    GuestDetail,
  },
  data() {
    return {
      found_guests: [],
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
  created() {
    this.loadData();
  },

  watch: {
    name: function (val) {
      this.foundGuests(val);
    },
    passport: function (val) {
      this.foundGuests(val);
    },
  },

  methods: {
    loadData() {
      this.guests = [];

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest_list/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.guests = response;
          this.foundGuests();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    rowClickHandler(record, index) {
      this.current_id = record.id;
      this.showModal();
    },

    addGuestPage() {
      this.current_id = 0;
      this.showModal();
    },

    foundGuests(val) {
      let res = [...this.guests];
      if (this.name) {
        res = res.filter((item) => {
          return (
            item.name.toLowerCase().includes(this.name) ||
            item.surname.toLowerCase().includes(this.name)
          );
        });
      }

      if (this.passport) {
        res = res.filter((item) => {
          return (
            (item.pasprot_series + "").includes(this.passport) ||
            (item.pasprot_number + "").includes(this.passport)
          );
        });
      }
      this.found_guests = res;
    },

    deleteHandler(id, name) {
      const res = confirm(`Вы точно хотите удалить "${name}" ?`);
      if (!res) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest_remove/`,
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

    showModal() {
      this.$refs["my-modal"].show();
    },

    closeModal() {
      this.$refs["my-modal"].hide();
    },
  },
};
</script>