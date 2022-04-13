<template>
  <div>
    <div class="d-flex container w-50 mt-5 mb-2 justify-content-center">
      <span>Наименование:</span>
      <input type="text" class="form-control ml-1 w-50" v-model="name" />
    </div>
    <div class="d-flex container w-95 mt-5 justify-content-center">

      <b-table
        hover
        :items="found_enqtype"
        :fields="fields"
        @row-clicked="rowClickHandler"
      >

        <template #cell(delete)="row">
          <b-button
            size="sm"
            @click="deleteHandler(row.item.id, row.item.name)"
            class="mr-2 btn-danger"
          >
            Удалить
          </b-button>
        </template>

      </b-table>

    </div>
    <div class="d-flex container w-100 mb-2 mt-3 justify-content-center">
      <button type="button" class="btn btn-success" @click="AddPage()">
        Добавить тип оборудования
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "EqpType",
  data() {
    return {
      enqtype: [],
      found_enqtype: [],
      name: "",
      fields: [
        {
          key: "name",
          label: "Наименование",
          sortable: true,
        },
        {
          key: "delete",
          label: "Удаление",
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    name: function (val) {
      this.foundEnqType(val);
    },
  },
  methods: {
    loadData() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.enqtype = response;
          this.foundEnqType();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    rowClickHandler(record, index) {
      const route = this.$router.resolve({
        name: "eqptypedetail",
        params: { id: record.id },
      });
      window.open(route.href, "_blank");
    },

    AddPage() {
      const route = this.$router.resolve({
        name: "eqptypedetail",
        params: { id: 0 },
      });
      window.open(route.href, "_blank");
    },

    foundEnqType(val) {
      this.found_enqtype = [...this.enqtype];
      if (this.name !== "") {
        this.found_enqtype = this.enqtype.filter((item) => {
          return item.name.toLowerCase().includes(val);
        });
      }
    },

    deleteHandler(id, name) {
      const res = confirm(`Вы точно хотите удалить "${name}" ?`);
      if (!res) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/remove_enq_type/`,
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
  },
};
</script>

<style>
</style>