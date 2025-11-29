<template>
  <v-ons-navigator
    animation="lift"
    v-model:page-stack="pageStack"
    @hide-loading-navigation="hideLoading"
    @pop-page-navigation="pageStack = pageStack.slice(0, -1)"
    @push-page-navigation="pageStack = [...pageStack, $event]"
    @replace-page-navigation="pageStack = [...pageStack.slice(0, -1), $event]"
    @show-loading-navigation="showLoading"
    @show-main-page-navigation="showMainPage"
  ></v-ons-navigator>
</template>

<script>
import { markRaw } from 'vue';
import signinPage from '@/components/SigninPage.vue';

export default {
  computed: {
    isAuthenticated: function () {
      return this.$store.getters['user/auth'] !== null;
    },
  },
  created: function () {},
  data() {
    return {
      pageStack: [markRaw(signinPage)],
    };
  },
  methods: {
    /**
     * ローディング画面を隠す
     */
    hideLoading: function () {
      this.$emit('hide-loading-tabber');
    },
    /**
     * ローディング画面を表示する
     */
    showLoading: function () {
      this.$emit('show-loading-tabber');
    },
    /**
     * メインページを表示する
     */
    showMainPage: function () {
      this.$emit('show-main-page-tabber');
    },
  },
  name: 'SigninNavigation',
  watch: {
    isAuthenticated(newVal, oldVal) {
      // 何もしない
    },
  },
};
</script>
