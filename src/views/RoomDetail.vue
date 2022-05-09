<template>
  <div>
    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Номер комнаты:"
    >
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.number.$model"
        :state="validateState('number')"
        aria-describedby="number-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="number-live-feedback"
        >Введите номер комнаты.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Тип комнаты:">
      <b-form-select
        type="number"
        class="form-control w-100"
        v-model="$v.form.type.$model"
        :state="validateState('type')"
        :options="types"
        aria-describedby="name-live-feedback"
      ></b-form-select>
      <b-form-invalid-feedback id="name-live-feedback"
        >Выберите тип номера.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Количество комнат:"
    >
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.rooms_qty.$model"
        :state="validateState('rooms_qty')"
        aria-describedby="rooms_qty-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="rooms_qty-live-feedback"
        >Введите количество комнат.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Количество спальных мест:"
    >
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.sleeper_qty.$model"
        :state="validateState('sleeper_qty')"
        aria-describedby="sleeper_qty-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="sleeper_qty-live-feedback"
        >Введите количество спальных мест.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Цена в сутки:">
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.daily_price.$model"
        :state="validateState('daily_price')"
        aria-describedby="daily_price-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="daily_price-live-feedback"
        >Введите цену в сутки.</b-form-invalid-feedback
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
          Добавить номер
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
  name: "RoomDetail",

  data() {
    return {
      types: [],
      update_mode: true,
      form: {
        number: null,
        type: null,
        rooms_qty: null,
        sleeper_qty: null,
        daily_price: null,
      },
    };
  },

  props: {
    current_object: {},
  },

  created() {
    this.loadTypes();
    if (this.current_object) {
      this.$v.form.$model = this.current_object;
      this.$v.form["type"].$model = this.current_object.typeid;
    } else {
      this.update_mode = false;
    }
  },

  validations: {
    form: {
      number: {
        required,
      },
      type: {
        required,
      },
      rooms_qty: {
        required,
      },
      sleeper_qty: {
        required,
      },
      daily_price: {
        required,
      },
    },
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    loadTypes() {
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

    add() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      let current_data = this.getCurrentData();

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          if (response.status == "error") {
            alert("Ошибка");
          }
          location.reload();
        },
        error: (response) => alert("Ошибка"),
      });
    },

    update() {
      let current_data = this.getCurrentData();
      current_data["id"] = this.id;

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room/`,
        type: "PATCH",
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

    getCurrentData() {
      return {
        number: this.$v.form["number"].$model,
        status: "...",
        rooms_qty: this.$v.form["rooms_qty"].$model,
        sleeper_qty: this.$v.form["sleeper_qty"].$model,
        daily_price: this.$v.form["daily_price"].$model,
        type: this.$v.form["type"].$model,
      };
    },
  },
};
</script>