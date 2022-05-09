<template>
  <div>
    <div class="mt-3 tabs">
      <b-tabs content-class="mt-1">
        <b-tab title="Номера" active>
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
                <b-button variant="outline-primary" @click="addRoomPage()">
                  Добавить комнату
                </b-button>
              </b-col>
              <b-col md="6">
                <div>
                  <span class="ml-1">Номер:</span>
                  <input
                    type="text"
                    class="form-control ml-1 w-100"
                    v-model="number"
                  />
                </div>
              </b-col>
            </b-row>
          </div>
          <StandartTable
            :items="found_rooms"
            :fields="fields"
            @row-click="rowClickHandler"
            @delete="deleteHandler"
          />
        </b-tab>

        <b-tab title="Типы номеров">
          <RoomType />
        </b-tab>
      </b-tabs>
    </div>
    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация о комнате">
        <RoomDetail :current_object="current_object" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import RoomType from "./RoomType.vue";
import RoomDetail from "./RoomDetail.vue";
import StandartTable from "../components/StandartTable.vue";

export default {
  name: "Rooms",
  components: {
    RoomType,
    RoomDetail,
    StandartTable,
  },
  data() {
    return {
      rooms: [],
      found_rooms: [],
      number: "",
      current_object: {},
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
          label: "",
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
        success: (response) => {
          this.rooms = response;
          this.foundRoom();
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    rowClickHandler(record, index) {
      this.current_object = JSON.parse(JSON.stringify(record));
      this.showModal();
    },

    addRoomPage() {
      this.current_object = null;
      this.showModal();
    },

    foundRoom(val) {
      this.found_rooms = [...this.rooms];
      if (this.number !== "") {
        this.found_rooms = this.rooms.filter((item) => {
          return (item.number + "").includes(val);
        });
      }
    },

    deleteHandler(temp) {
      const res = confirm(
        `Вы точно хотите удалить комнату ${temp.item.number} ?`
      );
      if (res) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/room/`,
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