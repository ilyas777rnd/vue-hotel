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
        >Введите наименование.</b-form-invalid-feedback
      >
    </b-form-group>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-5 mb-5 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          Обновить данные
        </button>
      </div>
    </template>

    <template v-else>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="add()">
          Добавить тип оборудования
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
  name: "EqpTypeDetail",

  data() {
    return {
      // name: '',
      form: {
        name: null,
      },
      update_mode: true,
    };
  },

  props: {
    id: Number,
  },

  created() {
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
    },
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type_get/${id}/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.$v.form["name"].$model = response.name;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    add() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          name: this.$v.form["name"].$model,
        },
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_type/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          name: this.name,
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