<template>
  <div>
    <div id="LeftMenu">
      <b-list-group>
        <b-list-group-item
          href="/"
          >Главная</b-list-group-item
        >
        <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/"
          >Бронирование</b-list-group-item
        >
        <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/guests"
          >Гости</b-list-group-item
        >
        <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/rooms"
          >Номера</b-list-group-item
        >
        <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/equipment"
          >Оборудование</b-list-group-item
        >
        <!-- <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/equipmentlist"
          >Список оборудования</b-list-group-item
        > -->
         <!-- <b-list-group-item
          v-if="this.$store.getters.isUserAuth"
          href="/eqptype"
          >Типы оборудования</b-list-group-item
        > -->
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
};
</script>

<style>
</style>