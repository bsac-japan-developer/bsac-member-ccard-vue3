<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header">事故報告入力ページ</div>
    <div id="content__body"></div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {},
  methods: {},
  name: 'IncidentReportInputPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';
</style>
