<template>
  <div>
    <div class="mt-3">
      <b-tabs content-class="mt-1">
        <b-tab title="Оборудование" active>
          <div class="d-flex container w-100 mb-2 mt-3">
            <button type="button" class="btn btn-success" @click="AddPage()">
              Добавить оборудование
            </button>
          </div>
          <div class="d-flex container w-100 mt-5 justify-content-center">
            <b-table
              hover
              :items="equipment"
              :fields="fields"
              @row-clicked="rowClickHandler"
            >
              <template #cell(delete)="row">
                <b-button
                  size="sm"
                  @click="deleteHandler(row.item.id, row.item.name)"
                  class="mr-2 btn-danger"
                >
                  Удалить
                </b-button>
              </template>
            </b-table>
          </div>
        </b-tab>

        <b-tab title="Список оборудования">
          <EquipmentList />
        </b-tab>

        <b-tab title="Типы оборудования">
          <EqpType />
        </b-tab>

      </b-tabs>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import EqpType from './EqpType.vue';
import EquipmentList from './EquipmentList.vue';

export default {
  name: "Equipment",
  components: {
    EqpType,
    EquipmentList,
  },
  data() {
    return {
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
      const route = this.$router.resolve({
        name: "equipmentdetail",
        params: { id: record.id },
      });
      window.open(route.href, "_blank");
    },

    AddPage() {
      const route = this.$router.resolve({
        name: "equipmentdetail",
        params: { id: 0 },
      });
      window.open(route.href, "_blank");
    },

    deleteHandler(id, name) {
      const res = confirm(`Вы точно хотите удалить "${name}" ?`);
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
          id: id,
        },
        success: (response) => location.reload(),
        error: (response) => alert("Ошибка"),
      });
    },
  },
};
</script>