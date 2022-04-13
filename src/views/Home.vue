<template>
  <div class="home">
    <section class="standart-section products-wrap">
       <h2 class="text-center mt-5" style="margin-bottom: 285px">
         Чтобы воспользоваться системой, пожалуйста авторизуйтесь.
       </h2>
    </section>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {},
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
