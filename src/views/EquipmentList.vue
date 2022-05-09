<template>
  <div>
    <div class="d-flex container w-100 mt-3 mb-2">
      <b-button variant="outline-primary" @click="AddPage()">
        Добавить оборудование
      </b-button>
    </div>

    <StandartTable
      :items="equipment"
      :fields="fields"
      @row-click="rowClickHandler"
      @delete="del"
    />

    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Информация об оборудовании">
        <div v-if="added">
          <EquipmentListDetail />
        </div>
        <div class="d-block text-center" v-else>
          <h5>
            Текущее количество "{{ current_name }}" в комнате
            {{ current_room }} - {{ current_qty }} шт.
          </h5>
          <input
            class="text-center"
            type="text"
            placeholder="Введите количество"
            v-model="new_qty"
          />
          <b-button
            class="mt-3"
            variant="outline-danger"
            block
            @click="set_qty()"
            >Изменить количество</b-button
          >
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import StandartTable from "../components/StandartTable.vue";
import EquipmentListDetail from "./EquipmentListDetail.vue";

export default {
  name: "EquipmentList",
  components: {
    StandartTable,
    EquipmentListDetail,
  },
  data() {
    return {
      equipment: [],
      added: true,
      current_qty: 0,
      new_qty: "",
      current_room: 0,
      current_name: "",
      current_id: 0,
      fields: [
        {
          key: "room",
          label: "Комната",
          sortable: true,
        },
        {
          key: "enquipment",
          label: "Оборудование",
          sortable: true,
        },
        {
          key: "qty",
          label: "Количество",
          sortable: true,
        },
        {
          key: "wearout",
          label: "Износ(%)",
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
    this.loadData();
  },
  methods: {
    loadData() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/eq_list/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => (this.equipment = response),
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    AddPage() {
      this.added = true;
      this.showModal();
      // window.location.href = "/equipmentlistdetail/0";
    },

    rowClickHandler(record, index) {
      this.added = false;
      this.current_qty = record.qty;
      this.current_name = record.enquipment;
      this.current_room = record.room;
      this.current_id = record.id;
      this.showModal();
    },

    del(temp) {
      console.log(temp.item);
      const res = confirm(
        `Вы точно хотите удалить ${temp.item.number} - ${temp.item.enquipment}?`
      );
      if (res) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/eq_list/`,
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

    ActivateModal(qty, name, room, id) {
      this.current_qty = qty;
      this.current_name = name;
      this.current_room = room;
      this.current_id = id;
      this.showModal();
    },

    showModal() {
      this.$refs["my-modal"].show();
    },

    closeModal() {
      this.$refs["my-modal"].hide();
    },

    set_qty() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_list/`,
        type: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        data: {
          id: this.current_id,
          qty: this.new_qty,
          enquipment: 1,
          room: 1,
        },
        success: (response) => {
          location.reload();
        },
        error: (response) => {
          alert("Ошибка, введите корректное число");
        },
      });
    },
  },
};
</script>