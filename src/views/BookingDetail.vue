<template>
  <div>
    <div class="booking-form">
      <b-form-group
        class="mt-1"
        id="example-input-group-1"
        label="Дата начала:"
      >
        <b-form-input
          class="w-50"
          id="startdate"
          v-model="$v.form.start_date.$model"
          :state="validateState('start_date')"
          type="date"
          placeholder="ДД-ММ-ДДДД"
          autocomplete="off"
          :disabled="
            this.current_status == 'Освобожден' ||
            this.current_status == 'Занят'
              ? true
              : false
          "
          aria-describedby="start-date-live-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="start-date-live-feedback"
          >Введите дату начала.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        class="mt-1"
        id="example-input-group-1"
        label="Дата окончания:"
      >
        <b-form-input
          class="w-50"
          id="startdate"
          v-model="$v.form.end_date.$model"
          :state="validateState('end_date')"
          type="date"
          placeholder="ДД-ММ-ДДДД"
          autocomplete="off"
          :disabled="
            this.current_status == 'Освобожден' ||
            this.current_status == 'Занят'
              ? true
              : false
          "
          aria-describedby="end-date-live-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="end-date-live-feedback"
          >Введите дату окончания.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group class="mt-1" id="example-input-group-1" label="Тип номера:">
        <b-form-select
          v-model="current_type"
          :options="types"
          class="w-50"
          :disabled="
            this.current_status == 'Освобожден' ||
            this.current_status == 'Занят'
              ? true
              : false
          "
        ></b-form-select>
      </b-form-group>

      <b-form-group class="mt-1" id="example-input-group-1" label="Номер:">
        <b-form-select
          class="w-50"
          v-model="$v.form.current_room.$model"
          :state="validateState('current_room')"
          :options="rooms"
          :disabled="
            this.current_status == 'Освобожден' ||
            this.current_status == 'Занят'
              ? true
              : false
          "
          aria-describedby="room-live-feedback"
        ></b-form-select>
        <b-form-invalid-feedback id="room-live-feedback"
          >Выберите номер комнаты.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        class="mt-1"
        id="example-input-group-1"
        label="Статус:"
        v-if="this.update_mode"
      >
        <b-form-select
          class="w-50"
          v-model="$v.form.current_status.$model"
          :state="validateState('current_status')"
          :options="status_variants"
        ></b-form-select>
      </b-form-group>

      <b-form-group class="mt-1" id="example-input-group-1" label="Всего:">
        <b-form-input
          type="number"
          class="form-control w-50"
          v-model="$v.form.total.$model"
          :state="validateState('total')"
          :disabled="
            this.update_mode && this.current_status !== 'Освобожден'
              ? false
              : true
          "
          aria-describedby="total-live-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="total-live-feedback"
          >Введите корректные даты, а так же номер
          комнаты.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group class="mt-1" id="example-input-group-1" label="Депозит:">
        <b-form-input
          type="number"
          class="form-control w-50"
          v-model="$v.form.deposit.$model"
          :state="validateState('deposit')"
          aria-describedby="deposit-live-feedback"
        >
        </b-form-input>
      </b-form-group>
      <b-form-invalid-feedback id="deposit-live-feedback"
        >Введите депозит.</b-form-invalid-feedback
      >
    </div>

    <template v-if="this.update_mode">
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <span> Гости:</span>
        <br />
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <span v-if="this.guests.length === 0"> СПИСОК ГОСТЕЙ ПУСТ</span>
        <ul class="list-group list-group-flush">
          <li v-for="guest in guests" :key="guest.id" class="list-group-item">
            {{ guest.name }} {{ guest.surname }} {{ guest.birth_date }}
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteGuest(guest)"
            >
              Удалить гостя
            </button>
          </li>
        </ul>
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <button type="button" class="btn btn-info" @click="showModal()">
          Добавить гостя
        </button>
      </div>
      <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
        <b-button variant="outline-primary" @click="update()">
          Сохранить бронь
        </b-button>
      </div>
    </template>

    <template v-else>
      <div class="add-guest" v-if="Object.keys(main_guest).length === 0">
        <div class="d-flex w-100 mt-5 mb-2 justify-content-center">
          <span> Добавление основного гостя: </span>
        </div>
        <div class="w-100 mt-3 mb-3 justify-content-center">
          <AddGuest @initGuest="initGuest" :booking_id="0" />
        </div>
      </div>
      <div v-else>
        <b-button
          variant="danger"
          class="justify-content-center"
          @click="resetGuest()"
          >Выбрать другого гостя</b-button
        >
      </div>
      <div class="d-flex container w-100 mt-2 justify-content-center">
        <b-button variant="outline-primary" @click="addBooking()">
          Подтвердить бронь
        </b-button>
      </div>
    </template>

    <div class="w-100">
      <b-modal ref="my-modal" size="xl" hide-footer title="Добавления гостя">
        <AddGuest :booking_id="this.id * 1" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters } from "vuex";
import AddGuest from "../components/AddGuest.vue";
import { validationMixin } from "vuelidate";
import { required, minValue } from "vuelidate/lib/validators";

const defaultForm = {
  start_date: "",
  end_date: "",
  current_type: "",
  current_room: "",
  current_status: "",
  total: 0,
  deposit: 0,
};

export default {
  mixins: [validationMixin],
  name: "BookingDetail",
  data() {
    return {
      id: 0,
      free: false,
      // start_date: "",
      // end_date: "",
      // status: "",
      // total: 0,
      // deposit: 0,
      guests: [],
      main_guest: {},
      rooms: [],
      current_room: "",
      current_room_obj: {},
      types: [],
      current_type: "",
      update_mode: true,
      status_variants: [],
      current_status: "",

      form: { ...defaultForm },
    };
  },
  components: { AddGuest },

  created() {
    let id = window.location.href.split("/")[4];
    if (id * 1 === 0) {
      this.update_mode = false;
    } else {
      this.id = id;
      this.loadData(id);
    }
    this.loadTypes();
    this.status_variants = this.$store.getters.getStatusVariants;
  },

  validations: {
    form: {
      start_date: { required },
      end_date: { required },
      current_type: {},
      current_room: { required },
      current_status: {},
      total: { required, minValue: minValue(1) },
      deposit: { required, minValue: minValue(0) },
    },
  },

  watch: {
    startDateChanged(val) {
      if (this.isPeriodInit) {
        this.loadRooms();
        this.calculatePrice();
      }
    },

    endDateChanged(val) {
      if (this.isPeriodInit) {
        this.loadRooms();
        this.calculatePrice();
      }
    },

    current_type(val) {
      if (this.isPeriodInit) {
        this.loadRooms();
      }
    },

    roomChanged(val) {
      this.calculatePrice();
    },
  },

  computed: {
    startDateChanged() {
      return this.$v.form["start_date"].$model !== defaultForm["start_date"]
        ? this.$v.form["start_date"].$model
        : null;
    },

    endDateChanged() {
      return this.$v.form["end_date"].$model !== defaultForm["end_date"]
        ? this.$v.form["end_date"].$model
        : null;
    },

    typeChanged() {
      return this.$v.form["current_type"].$model !== defaultForm["current_type"]
        ? this.$v.form["current_type"].$model
        : null;
    },

    roomChanged() {
      return this.$v.form["current_room"].$model !== defaultForm["current_room"]
        ? this.$v.form["current_room"].$model
        : null;
    },

    isPeriodInit() {
      return (
        this.$v.form["start_date"].$model && this.$v.form["end_date"].$model
      );
    },
  },

  methods: {
    ...mapGetters({
      getUserId: "getUserId",
      getStatusVariants: "getStatusVariants",
    }),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    calculatePrice() {
      if (
        this.isPeriodInit &&
        this.$v.form["current_room"].$model &&
        !this.update_mode
      ) {
        let total =
          this.datediff(
            this.parseDate(this.$v.form["start_date"].$model),
            this.parseDate(this.$v.form["end_date"].$model)
          ) *
          this.getPriceById(this.$v.form["current_room"].$model) *
          1;
        if (total <= 0) {
          alert("Введите корректные даты начала и конца");
          this.$v.form["total"].$model = 0;
          this.$v.form["start_date"].$model = "";
          this.$v.form["end_date"].$model = "";
        } else {
          this.$v.form["total"].$model = total;
        }
      }
    },

    getPriceById(id) {
      let found = this.rooms.find((element) => element.value === id);
      if (found) {
        return found.price;
      } else {
        alert("Некорректный номер комнаты");
      }
    },

    async loadData(id) {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking_detail/${id}/`,
        type: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.$v.form["start_date"].$model = data.start_date;
          this.$v.form["end_date"].$model = data.end_date;
          this.$v.form["current_status"].$model = data.status;
          this.$v.form["total"].$model = Number(data.total);
          this.$v.form["deposit"].$model = data.deposit;
          this.guests = data.guests;
          this.loadRooms(this.start_date, this.end_date);

          this.current_room_obj = {
            value: data.roomid,
            text: data.room,
            price: data.dailyprice,
          };
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    async loadTypes() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_type_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          let data = response;
          this.types = [];
          this.types.push({ value: null, text: "Все типы" });
          data.map((element) => {
            this.types.push({ value: element.id, text: element.name });
          });
          this.current_type = null;
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    loadRooms() {
      let current_data = {
        start_date: this.$v.form["start_date"].$model,
        end_date: this.$v.form["end_date"].$model,
      };

      this.current_type
        ? (current_data["type"] = this.current_type)
        : (current_data["type"] = null);

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: current_data,
        success: (response) => {
          let data = response;
          this.rooms = data.map((element) => {
            return {
              value: element.id,
              text: element.number,
              type: element.type,
              typeid: element.typeid,
              price: element.daily_price,
            };
          });

          //В response имеются лишь те номера,что доступные в эти даты
          //Так как номер, соответствующий этой брони - занят, его нет в response
          //Поэтому, подставляем отдельно
          if (!$.isEmptyObject(this.current_room_obj)) {
            this.rooms.push(this.current_room_obj);
            this.$v.form["current_room"].$model = this.current_room_obj.value;
          }
        },
        error: (response) => alert("Ошибка"),
      });
    },

    update() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.id,
          start_date: this.$v.form["start_date"].$model,
          end_date: this.$v.form["end_date"].$model,
          status: "Забронирован",
          total: this.$v.form["total"].$model,
          deposit: this.$v.form["deposit"].$model,
          room: this.$v.form["current_room"].$model,
          manager: this.$store.getters.getUserId,
        },
        success: (response) => {
          if (response.status === "error") {
            alert("Ошибка");
            return;
          }
          window.location.href = `/bookingdetail/${response.id}`;
        },
        error: (response) => alert("Ошибка"),
      });
    },

    initGuest(data) {
      if (this.checkAge(data)) {
        this.main_guest = data;
      } else {
        alert("Гостю должно не менее 18 лет");
        this.resetGuest();
      }
    },

    resetGuest() {
      this.main_guest = {};
    },

    checkAge(guest) {
      let today = this.$store.getters.getCurrentDate;
      let delta = this.datediff(
        this.parseDate(guest.birth_date),
        this.parseDate(today)
      );
      if (delta >= 6570) {
        return true;
      } else {
        return false;
      }
    },

    async addBooking() {
      let addGuest = document.getElementById("btAddGuest");
      if (addGuest) {
        addGuest.click();
      }

      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      if (Object.keys(this.main_guest).length === 0) {
        alert("Введите данные гостя");
        return;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/booking/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: this.$v.form["start_date"].$model,
          end_date: this.$v.form["end_date"].$model,
          status: "Забронирован",
          total: this.$v.form["total"].$model,
          deposit: this.$v.form["deposit"].$model,
          room: this.$v.form["current_room"].$model,
          manager: this.$store.getters.getUserId,
          guest: this.main_guest,
        },
        success: (response) => {
          if (response.status == "add") {
            window.location.href = `/bookingdetail/${response.id}`;
          }
        },
        error: (response) => alert("Ошибка"),
      });
    },

    deleteGuest(guest) {
      const res = confirm(
        `Вы точно хотите удалить ${guest.name} ${guest.surname} ${guest.birth_date} ?`
      );
      if (res) {
        let guest_id = guest.id;
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/booking_remove_guest/`,
          type: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth_token")}`,
          },
          data: {
            guest: guest_id,
            booking: this.id,
          },
          success: (response) => location.reload(),
          error: (response) => alert("Ошибка"),
        });
      }
    },

    parseDate(str) {
      let date = str.split("-");
      return new Date(date[0], date[1] - 1, date[2]);
    },

    datediff(first, second) {
      return Math.round((second - first) / (1000 * 60 * 60 * 24));
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