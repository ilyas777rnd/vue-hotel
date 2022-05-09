<template>
  <div>
    <div class="d-flex container w-100 mt-3">
      <b-button variant="outline-primary" @click="AddPage()">
        Добавить тип оборудования
      </b-button>
      <span class="ml-5 mr-1">Наименование:</span>
      <input type="text" class="form-control ml-1 w-25" v-model="name" />
    </div>
    <StandartTable
      :items="found_enqtype"
      :fields="fields"
      @row-click="rowClickHandler"
      @delete="deleteHandler"
    />
    <b-modal ref="my-modal" hide-footer title="Информация о комнате">
      <EqpTypeDetail :id="current_id" />
    </b-modal>
  </div>
</template>

<script>
import $ from "jquery";
import EqpTypeDetail from "./EqpTypeDetail.vue";
import StandartTable from "../components/StandartTable.vue";

export default {
  name: "EqpType",
  components: {
    EqpTypeDetail,
    StandartTable
  },
  data() {
    return {
      current_id: "",
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
          label: "",
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
      this.current_id = record.id;
      this.showModal();
    },

    AddPage() {
      this.current_id = 0;
      this.showModal();
    },

    foundEnqType(val) {
      this.found_enqtype = [...this.enqtype];
      if (this.name !== "") {
        this.found_enqtype = this.enqtype.filter((item) => {
          return item.name.toLowerCase().includes(val);
        });
      }
    },

    deleteHandler(temp) {
      const res = confirm(`Вы точно хотите удалить "${temp.item.name}" ?`);
      if (!res) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type/`,
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

<style>
</style>