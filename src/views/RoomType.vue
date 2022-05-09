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
        <b-col md="5">
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
          <b-button variant="outline-primary" @click="AddPage()">
            Добавить тип номера
          </b-button>
        </b-col>
        <b-col md="6">
          <div>
            <span class="ml-1">Наименование:</span>
            <input type="text" class="form-control ml-1 w-100" v-model="name" />
          </div>
        </b-col>
      </b-row>
    </div>
    <StandartTable
      :items="found_roomtype"
      :fields="fields"
      @row-click="rowClickHandler"
      @delete="deleteHandler"
    />
    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация о комнате">
        <RoomTypeDetail :id="current_id" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import RoomTypeDetail from "./RoomTypeDetail.vue";
import StandartTable from "../components/StandartTable.vue";

export default {
  name: "RoomType",
  components: {
    StandartTable,
    RoomTypeDetail,
  },
  data() {
    return {
      roomtype: [],
      found_roomtype: [],
      current_id: 0,
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

  watch: {
    name: function (val) {
      this.foundRoomType(val);
    },
  },

  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.roomtype = response;
          this.foundRoomType();
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

    foundRoomType(val) {
      this.found_roomtype = [...this.roomtype];
      if (this.name !== "") {
        this.found_roomtype = this.roomtype.filter((item) => {
          return item.name.toLowerCase().includes(val);
        });
      }
    },

    deleteHandler(temp) {
      const res = confirm(`Вы точно хотите удалить "${temp.item.name}" ?`);
      if (res) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/room_type/`,
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

<style>
</style>