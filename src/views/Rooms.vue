<template>
  <div>
    <div class="mt-3">
      <b-tabs content-class="mt-1">
        <b-tab title="Номера" active>
          <div class="d-flex container w-100 mb-1 mt-3">
            <button
              type="button"
              class="btn btn-success"
              @click="addRoomPage()"
            >
              Добавить комнату
            </button>
          </div>
          <div class="d-flex container w-50 mt-1 mb-2 justify-content-center">
            <span>Номер:</span>
            <input type="text" class="form-control ml-1 w-50" v-model="number" />
          </div>
          <div class="d-flex w-95 mt-5 justify-content-center">
            <b-table
              hover
              :items="found_rooms"
              :fields="fields"
              @row-clicked="rowClickHandlerRoom"
            >
              <template #cell(delete)="row">
                <b-button
                  size="sm"
                  @click="deleteRoomHandler(row.item.id, row.item.number)"
                  class="mr-2 btn-danger"
                >
                  <b-icon icon="trash-fill" aria-hidden="true"></b-icon> Удалить
                </b-button>
              </template>
            </b-table>
          </div>
        </b-tab>

        <b-tab title="Типы номеров">
          <RoomType />
        </b-tab>
      </b-tabs>
    </div>
    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация о комнате">
        <RoomDetail :id="current_id" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import RoomType from "./RoomType.vue";
import RoomDetail from './RoomDetail.vue';

export default {
  name: "Rooms",
  components: {
    RoomType,
    RoomDetail,
  },
  data() {
    return {
      rooms: [],
      found_rooms: [],
      number: "",
      current_id: 0,
      fields: [
        {
          key: "number",
          label: "Номер",
          sortable: true,
        },
        {
          key: "type",
          label: "Тип",
          sortable: true,
        },
        {
          key: "rooms_qty",
          label: "Количество комнат",
          sortable: true,
        },
        {
          key: "sleeper_qty",
          label: "Количество спальных мест",
          sortable: true,
        },
        {
          key: "daily_price",
          label: "Цена в сутки",
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
    this.loadRooms();
  },

  watch: {
    number: function (val) {
      this.foundRoom(val);
    },
  },

  methods: {
    loadRooms() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          start_date: "",
          end_date: "",
        },
        success: (response) => {
          this.rooms = response;
          this.foundRoom();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    rowClickHandlerRoom(record, index) {
      this.current_id = record.id;
      this.showModal()
    },

    addRoomPage() {
      this.current_id = 0;
      this.showModal();
    },

    foundRoom(val){
      this.found_rooms = [...this.rooms];
      if (this.number !== "") {
        this.found_rooms = this.rooms.filter((item) => {
          return (item.number + "").includes(val);
        });
      }
    },

    deleteRoomHandler(id, name) {
      const res = confirm(`Вы точно хотите удалить комнату ${name} ?`);
      if (!res) {
        return;
      }
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/room_remove/`,
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