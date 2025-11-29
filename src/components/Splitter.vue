<template>
  <v-ons-splitter>
    <v-ons-splitter-side width="150px" collapse="" side="left" v-model:open="openSide">
      <v-ons-page>
        <v-ons-list>
          <v-ons-list-header>Menu</v-ons-list-header>
          <v-ons-list-item
            v-for="page in pages"
            :key="page.id"
            tappable
            modifier="chevron"
            @click="changePage(page.id)"
          >
            <div class="center">{{ page.name }}</div>
          </v-ons-list-item>
        </v-ons-list>
      </v-ons-page>
    </v-ons-splitter-side>

    <v-ons-splitter-content>
      <component
        :is="currentPage"
        :toggle-menu="() => (openSide = !openSide)"
        @change-page="changePage"
        :active-tab.sync="activeTab"
      ></component>
    </v-ons-splitter-content>
  </v-ons-splitter>
</template>
<script>
import { provide, reactive } from 'vue';
import mainTabber from '@/components/MainTabber.vue';

export default {
  components: {
    mainTabber,
  },
  created: function () {},
  data() {
    return {
      currentPage: 'mainTabber',
      pages: [{ id: 'cardNavigation', name: 'ランク', tabIndex: 0 }],
      openSide: false,
      activeTab: 0,
    };
  },
  methods: {
    /**
     * ページを切り替える
     * @param page
     */
    changePage: function (page) {
      this.pages.forEach((item) => {
        if (page === item.id) {
          this.activeTab = item.tabIndex;
          this.openSide = false;
          return;
        }
      });
    },
    toggleMenu: function () {
      this.openSide = !this.openSide;
    },
  },
  mounted: function () {
    this.eventBus.on('toggle-menu', this.toggleMenu);
  },
  name: 'Splitter',
  setup: function () {
    const eventBus = reactive({
      emit: (event, ...args) => {
        eventBus[event]?.(...args);
      },
      on: (event, callback) => {
        if (!eventBus[event]) {
          eventBus[event] = callback;
        }
      },
    });
    provide('eventBus', eventBus);
    return { eventBus };
  },
};
</script>
