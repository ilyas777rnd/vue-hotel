<template>
  <div>
    <div id="LeftMenu">
      <b-list-group>
        <b-list-group-item
          :active="
            active_page == '' || active_page == 'bookingdetail' ? true : false
          "
          href="/"
          >Главная</b-list-group-item
        >
        <b-list-group-item
          :active="active_page == 'guests' ? true : false"
          v-if="this.$store.getters.isUserAuth"
          href="/guests"
          >Гости</b-list-group-item
        >
        <b-list-group-item
          :active="active_page == 'rooms' ? true : false"
          v-if="this.$store.getters.isUserAuth"
          href="/rooms"
          >Номера</b-list-group-item
        >
        <b-list-group-item
          :active="active_page == 'equipment' ? true : false"
          v-if="this.$store.getters.isUserAuth"
          href="/equipment"
          >Оборудование</b-list-group-item
        >
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {
      active_page: "",
    };
  },
  created() {
    let page = window.location.href.split("/")[3];
    if (page) {
      this.active_page = page;
    } else {
      this.active_page = "";
    }
  },
};
</script>

<style>
</style>