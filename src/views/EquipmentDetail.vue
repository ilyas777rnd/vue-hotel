<template>
  <div>
    <b-form-group class="mt-1" id="example-input-group-1" label="Наименование:">
      <b-form-input
        type="text"
        class="form-control w-100"
        v-model="$v.form.name.$model"
        :state="validateState('name')"
        aria-describedby="name-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="name-live-feedback"
        >Введите номер комнаты.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Тип:">
      <b-form-select
        type="number"
        class="form-control w-100"
        v-model="$v.form.type.$model"
        :state="validateState('type')"
        :options="types"
        aria-describedby="type-live-feedback"
      ></b-form-select>
      <b-form-invalid-feedback id="type-live-feedback"
        >Выберите тип оборудования.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Износ:">
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.wearout.$model"
        :state="validateState('wearout')"
        aria-describedby="wearout-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="wearout-live-feedback"
        >Введите износ оборудования.</b-form-invalid-feedback
      >
    </b-form-group>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Обновить данные
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
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "EquipmentDetail",
  data() {
    return {
      form: {
        name: "",
        wearout: 0,
        type: "",
      },
      types: [],
      update_mode: true,
    };
  },

  props: {
    id: Number,
  },

  created() {
    this.loadTypes();
    if (this.id * 1 === 0) {
      this.update_mode = false;
      return;
    }
    this.loadData(this.id);
  },

  validations: {
    form: {
      name: {
        required,
      },
      type: {
        required,
      },
      wearout: {
        required,
      },
    },
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment_get/${id}/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.$v.form["name"].$model = response.name;
          this.$v.form["wearout"].$model = response.wearout;
          this.$v.form["type"].$model = response.typeid;
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
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: this.$v.form.$model,
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка подключения");
        },
      });
    },

    update() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      let current_data = this.$v.form.$model;
      current_data["id"] = this.id;

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
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