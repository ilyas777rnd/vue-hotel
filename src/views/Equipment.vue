<template>
  <div>
    <div class="mt-3">
      <b-tabs content-class="mt-1">
        <b-tab title="Оборудование" active>
          <div class="d-flex container w-100 mb-2 mt-3">
            <b-button variant="outline-primary" @click="AddPage()">
              Добавить оборудование
            </b-button>
          </div>
          <StandartTable
            :items="equipment"
            :fields="fields"
            @row-click="rowClickHandler"
            @delete="deleteHandler"
          />
        </b-tab>

        <b-tab title="Список оборудования">
          <EquipmentList />
        </b-tab>

        <b-tab title="Типы оборудования">
          <EqpType />
        </b-tab>
      </b-tabs>
      <div class="w-100">
        <b-modal ref="eqp-modal" hide-footer title="Информация об оборудовании">
          <EquipmentDetail :id="current_id" />
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import EqpType from "./EqpType.vue";
import EquipmentList from "./EquipmentList.vue";
import StandartTable from "../components/StandartTable.vue";
import EquipmentDetail from "./EquipmentDetail.vue";

export default {
  name: "Equipment",
  components: {
    EqpType,
    EquipmentList,
    StandartTable,
    EquipmentDetail,
  },
  data() {
    return {
      current_id: 0,
      equipment: [],
      fields: [
        {
          key: "name",
          label: "Название",
          sortable: true,
        },
        {
          key: "type",
          label: "Тип",
          sortable: true,
        },
        {
          key: "wearout",
          label: "Износ(%)",
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
    this.loadData();
  },
  methods: {
    loadData() {
      $.ajax({
        url: `${this.$store.getters.getServerUrl}/equipment_get/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => (this.equipment = response),
        error: (response) => alert("Ошибка"),
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

    deleteHandler(temp) {
      const res = confirm(`Вы точно хотите удалить "${temp.item.name}" ?`);
      if (res) {
        $.ajax({
          url: `${this.$store.getters.getServerUrl}/equipment_remove/`,
          type: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("auth_token")}`,
          },
          data: {
            id: temp.item.id,
          },
          success: (response) => location.reload(),
          error: (response) => alert("Ошибка"),
        });
      }
    },

    showModal() {
      this.$refs["eqp-modal"].show();
    },

    closeModal() {
      this.$refs["eqp-modal"].hide();
    },
  },
};
</script>