<template>
  <div class="mt-4 clickable">
    <b-table hover :items="items" :fields="fields" @row-clicked="rowClick">
      <template #cell(delete)="row">
        <b-icon
          id="deleteIcon"
          @click="deleteHandler(row)"
          icon="trash-fill"
          aria-hidden="true"
        ></b-icon>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "StandartTable",
  data() {
    return {
      deleted: false,
    };
  },
  props: {
    items: Array,
    fields: Array,
  },
  methods: {
    rowClick(record, index) {
      if (this.deleted) {
        this.deleted = false;
        return;
      }
      this.$emit("row-click", record);
    },
    deleteHandler(row) {
      this.deleted = true;
      this.$emit("delete", row);
    },
  },
};
</script>

<style>
</style>