<template>
  <div class="justify-content-center w-75">
    <b-form-group label="Способ добавления гостя:" class="ml-4">
      <b-form-radio v-model="guest_add_variant" name="some-radios" value="0"
        >Добавить нового гостя</b-form-radio
      >
      <b-form-radio v-model="guest_add_variant" name="some-radios" value="1"
        >Выбрать из имеющихся</b-form-radio
      >
    </b-form-group>
    <div class="w-100 guest-table" v-if="guest_add_variant == 1">
      <Guests
        :on_modal="true"
        :booking_id="this.booking_id"
        @initGuest="initGuest"
      />
    </div>
    <div class="w-100 new-guest" v-else>
      <GuestDetail
        :id="0"
        :on_modal="true"
        :booking_id="this.booking_id"
        @initGuest="initGuest"
      />
    </div>
  </div>
</template>

<script>
import Guests from "../views/Guests.vue";
import GuestDetail from "../views/GuestDetail.vue";

export default {
  name: "AddGuest",

  components: {
    Guests,
    GuestDetail,
  },

  props: {
    booking_id: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      guest_add_variant: 0,
    };
  },

  methods: {
    initGuest(data) {
      this.$emit("initGuest", data);
    },
  },
};
</script>

<style>
.new-guest {
  margin-left: 30%;
}

.guest-table {
  margin-left: 20%;
}
</style>