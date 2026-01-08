<template>
  <v-ons-page>
    <splitter-toolbar :title="'お知らせ'"></splitter-toolbar>
    <div id="content__header"></div>
    <div id="content__body"></div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';

export default {
  components: {
    splitterToolbar,
  },
  computed: {},
  methods: {},
  name: 'NotificationListPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
