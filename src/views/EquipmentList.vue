<template>
  <div>
    <div class="d-flex w-95 mt-5 justify-content-center">

      <b-table
        hover
        :items="equipment"
        :fields="fields"
      >
        <template #cell(update)="row">
          <b-button
            size="sm"
            @click="
              ActivateModal(
                row.item.qty,
                row.item.name,
                row.item.number,
                row.item.id
              )
            "
            class="mr-2 btn-info"
          >
            Изменить количество
          </b-button>
        </template>

        <template #cell(delete)="row">
          <b-button
            size="sm"
            @click="del(row.item.id, row.item.number, row.item.name)"
            class="mr-2 btn-danger"
          >
            Удалить
          </b-button>
        </template>
      </b-table>

    </div>
    <div class="d-flex container w-100 mt-5 mb-2 justify-content-center">
      <button type="button" class="btn btn-success" @click="AddPage()">
        Добавить оборудование
      </button>
    </div>

    <div class="w-100">
      <b-modal ref="my-modal" hide-footer title="Изменить количество">
        <div class="d-block text-center">
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
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeModal()"
          >Отмена</b-button
        >
      </b-modal>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "EquipmentList",
  data() {
    return {
      equipment: [],
      //showModal: false,
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
          key: "update",
          label: "Изменить количество",
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
        url: `${this.$store.getters.getServerUrl}/enq_list_view/`,
        type: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
        success: (response) => {
          this.equipment = response;
          console.log(this.equipment);
          // this.equipment = response.data.map((element) => {
          //   return {
          //     id: element.id,
          //     number: element.attributes.room.number,
          //     name: element.attributes.enquipment.name,
          //     qty: element.attributes.qty,
          //     wearout: element.attributes.enquipment.wearout,
          //   };
          // });
        },
        error: (response) => {
          alert("Ошибка");
        },
      });
    },

    AddPage() {
      const route = this.$router.resolve({
        name: "equipmentlistdetail",
        params: { id: 0 },
      });
      window.open(route.href, "_blank");
    },

    del(id, number, name) {
      const res = confirm(`Вы точно хотите удалить ${number} - ${name}?`);
      if (!res) {
        return;
      }

      $.ajax({
        url: `${this.$store.getters.getServerUrl}/enq_list_remove/`,
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