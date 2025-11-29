<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-toolbar-button @click="emitToggleMenu">
        <v-ons-icon icon="ion-ios-menu, material:md-menu" size="3rem, material: 3rem"></v-ons-icon>
      </v-ons-toolbar-button>
    </div>
    <div class="center">{{ title }} {{ this.$store.getters['env/mode'] }}</div>
    <div class="right">
      <img v-if="!online" src="../../../www/images/wifi_off.png" class="wifi-off-image" />
    </div>
  </v-ons-toolbar>
</template>

<script>
import { inject } from 'vue';

export default {
  computed: {
    online: function () {
      return this.$store.getters['env/online'];
    },
  },
  created: function () {},
  name: 'SplitterToolbar',
  props: ['title'],
  setup: function () {
    const eventBus = inject('eventBus');

    const emitToggleMenu = () => {
      eventBus.emit('toggle-menu');
    };

    return {
      emitToggleMenu,
    };
  },
};
</script>

<style scoped>
.v-ons-toolbar {
  margin: 1rem 0 0 0;
}

.wifi-off-image {
  margin: 0 1rem 0 0;
  width: 3rem;
}
</style>
