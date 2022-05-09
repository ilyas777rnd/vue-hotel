<template>
  <div class="home mb-5 mt-5">
    <!-- <section class="standart-section products-wrap mb-5 mt-5">
      <h4>
        Чтобы воспользоваться системой, пожалуйста авторизуйтесь.
      </h4>
    </section> -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {},
  created() {
    if (this.$store.getters.isUserAuth) {
      //console.log(this.$store.getters.isUserAuth);
      window.location.href = "/";
    }
  },
  methods: {
    ...mapGetters({
      isUserAuth: "isUserAuth",
    }),
    ...mapMutations({
      authenticated: "authenticated",
    }),
  },
};
</script>

<style scoped>
h4 {
  margin-left: 250px;
  margin-bottom: 90px;
}
</style>
