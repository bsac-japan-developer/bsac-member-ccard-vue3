<template>
  <v-ons-page>
    <splitter-toolbar :title="'事故報告'"></splitter-toolbar>
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
  name: 'IncidentReportFrontPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
