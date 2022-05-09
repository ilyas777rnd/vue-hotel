<template>
  <div>
    <b-form-group class="mt-1" id="example-input-group-1" label="Имя:">
      <b-form-input
        type="text"
        class="form-control w-100"
        v-model="$v.form.name.$model"
        :state="validateState('name')"
        aria-describedby="name-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="name-live-feedback"
        >Введите имя.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Фамилия:">
      <b-form-input
        type="text"
        class="form-control w-100"
        v-model="$v.form.surname.$model"
        :state="validateState('surname')"
        aria-describedby="surname-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="surname-live-feedback"
        >Введите фамилию.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Серия паспорта:"
    >
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.pasprot_series.$model"
        :state="validateState('pasprot_series')"
        aria-describedby="pasprot_series-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="pasprot_series-live-feedback"
        >Введите серию паспорта.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Номер паспорта:"
    >
      <b-form-input
        type="number"
        class="form-control w-100"
        v-model="$v.form.pasprot_number.$model"
        :state="validateState('pasprot_number')"
        aria-describedby="pasprot_number-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="pasprot_number-live-feedback"
        >Введите номер паспорта.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Дата рождения:"
    >
      <b-form-input
        type="date"
        placeholder="ДД-ММ-ДДДД"
        autocomplete="off"
        class="form-control w-100"
        v-model="$v.form.birth_date.$model"
        :state="validateState('birth_date')"
        aria-describedby="birth_date-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="birth_date-live-feedback"
        >Введите дату рождения.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group
      class="mt-1"
      id="example-input-group-1"
      label="Мобильный телефон:"
    >
      <div class="d-flex">
        <b-form-select
          class="w-25"
          v-model="code"
          :options="codes"
        ></b-form-select>
        <b-form-input
          type="text"
          class="form-control w-75 ml-2"
          v-model="$v.form.phone.$model"
          :state="validateState('phone')"
          @input="handleUserInput"
          aria-describedby="phone-live-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="phone-live-feedback"
          >Введите номер телефона.</b-form-invalid-feedback
        >
      </div>
    </b-form-group>

    <b-form-group class="mt-1" id="example-input-group-1" label="Email:">
      <b-form-input
        type="text"
        class="form-control w-100"
        v-model="$v.form.email.$model"
        :state="validateState('email')"
        aria-describedby="email-live-feedback"
      ></b-form-input>
      <b-form-invalid-feedback id="email-live-feedback"
        >Введите email.</b-form-invalid-feedback
      >
    </b-form-group>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <button type="button" class="btn btn-success" @click="update()">
          OK
        </button>
      </div>
    </template>

    <template>
      <div class="d-flex container w-100 mt-2 mb-2 justify-content-center">
        <b-button
          variant="outline-primary"
          id="btAddGuest"
          v-bind:class="{ hide: hide_button }"
          @click="addGuest()"
        >
          Добавить
        </b-button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "GuestDetail",

  props: {
    current_object: {},
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
      update_mode: true,
      hide_button: false,
      code: "",
      codes: [],
      form: {
        name: null,
        surname: null,
        pasprot_series: null,
        pasprot_number: null,
        birth_date: null,
        phone: null,
        email: null,
      },
    };
  },

  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(50),
      },
      surname: {
        required,
        maxLength: maxLength(50),
      },
      pasprot_series: {
        required,
        maxLength: maxLength(4),
        minLength: minLength(4),
      },
      pasprot_number: {
        required,
        maxLength: maxLength(6),
        minLength: minLength(6),
      },
      birth_date: {
        required,
      },
      phone: {
        required,
        maxLength: maxLength(13),
        minLength: minLength(13),
      },
      email: {
        required,
        email,
        maxLength: maxLength(14),
      },
    },
  },

  created() {
    this.codes = this.$store.getters.getCountryCodes;
    this.code = "+7";

    if (this.current_object) {
      this.$v.form.$model = this.current_object;
      return;
    } else {
      if (this.booking_id >= 0) {
        this.update_mode = false;

        if (this.booking_id == 0) {
          this.hide_button = true;
        } else {
          this.hide_button = false;
        }
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    handleUserInput(input) {
      var replacedInput = this.$v.form["phone"].$model
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.$v.form["phone"].$model = !replacedInput[2]
        ? replacedInput[1]
        : "(" +
          replacedInput[1] +
          ")" +
          replacedInput[2] +
          (replacedInput[3] ? "-" + replacedInput[3] : "");
    },

    async addGuest() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      let current_data = {
        name: this.$v.form["name"].$model,
        surname: this.$v.form["surname"].$model,
        pasprot_series: this.$v.form["pasprot_series"].$model,
        pasprot_number: this.$v.form["pasprot_number"].$model,
        birth_date: this.$v.form["birth_date"].$model,
        phone: `${this.code}${this.$v.form["phone"].$model}`,
        email: this.$v.form["email"].$model,
      };

      if (this.booking_id == 0) {
        this.$emit("initGuest", current_data);
        return;
      }

      if (this.booking_id > 0) {
        current_data["booking"] = this.booking_id;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          if (this.on_modal) {
            location.reload();
          } else {
            window.location.href = "/guests";
          }
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    update() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/guest/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.current_object.id,
          name: this.$v.form["name"].$model,
          surname: this.$v.form["surname"].$model,
          pasprot_series: this.$v.form["pasprot_series"].$model,
          pasprot_number: this.$v.form["pasprot_number"].$model,
          birth_date: this.$v.form["birth_date"].$model,
          phone: `${this.code}${this.$v.form["phone"].$model}`,
          email: this.$v.form["email"].$model,
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