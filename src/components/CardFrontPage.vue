<template>
  <v-ons-page>
    <splitter-toolbar :title="'ランク'"></splitter-toolbar>
    <div id="content__header">ヘッダー</div>
    <div id="content__body">ボディ</div>
    <div id="content__footer">フッター</div>
  </v-ons-page>
</template>

<script>
import splitterToolbar from '@/components/parts/SplitterToolbar.vue';

export default {
  components: {
    splitterToolbar,
  },
  computed: {},
  created: function () {},
  data() {
    return {};
  },
  methods: {},
  name: 'CardFrontPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
</style>
