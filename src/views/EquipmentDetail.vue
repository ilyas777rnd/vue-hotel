<template>
  <div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Наименование:</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="name"
      />
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Тип:</span>
      <b-form-select
        v-model="current_type"
        :options="types"
        style="width: 27%"
      ></b-form-select>
    </div>

    <div class="d-flex container w-100 mt-5 mb-2 justify-content-between">
      <span>Износ(%):</span>
      <input
        type="text"
        style="width: 27%"
        class="form-control"
        v-model="wearout"
      />
    </div>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Обновить данные
        </button>
      </div>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-danger" @click="del()">
          Удалить оборудование
        </button>
      </div>
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="add()">
          Добавить оборудованиe
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "EquipmentDetail",
  data() {
    return {
      id: 0,
      name: "",
      wearout: "",
      current_type: "",
      current_type_id: 0,
      types: [],
      update_mode: true,
    };
  },

  created() {
    let id = window.location.href.split("/")[4];
    this.loadTypes();
    if (id * 1 === 0) {
      this.update_mode = false;
      return;
    }
    this.id = id;
    this.loadData(id);
  },

  methods: {
    loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment_get/${id}/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.name = response.name;
          this.wearout = response.wearout;
          this.current_type = response.typeid;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    loadTypes() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type_get/`,
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

    add() {
      if (!$.isNumeric(this.current_type)) {
        const elem = this.types.find((el) => el.label === this.current_type);
        this.current_type = elem.id;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          name: this.name,
          type: this.current_type,
          wearout: this.wearout,
        },
        success: (response) => {
          window.location.href = "/equipment";
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    del() {
      const res = confirm(`Вы точно хотите удалить ${this.id} - ${this.name}?`);
      if (!res) {
        return;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment_remove/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
        },
        success: (response) => {
          window.location.href = "/equipment";
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update() {
      if (!$.isNumeric(this.current_type)) {
        const elem = this.types.find((el) => el.label === this.current_type);
        this.current_type = elem.id;
      }
      console.log(this.current_type);

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          name: this.name,
          type: this.current_type,
          wearout: this.wearout,
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