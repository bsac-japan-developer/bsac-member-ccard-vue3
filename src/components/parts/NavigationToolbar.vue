<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-back-button :on-click="pop">{{ backLabel }}</v-ons-back-button>
    </div>
    <div class="center"><slot></slot>{{ this.$store.getters['env/mode'] }}</div>
  </v-ons-toolbar>
</template>

<script>
export default {
  created: function () {},
  name: 'NavigationToolbar',
  props: ['pop', 'backLabel'],
};
</script>
