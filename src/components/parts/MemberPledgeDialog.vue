<template>
  <v-ons-dialog :visible="dialogVisible" @update:visible="closeDialog">
    <div class="modal-content">
      <p class="explain">
        下記を読んで、内容に同意していただいた場合は「同意します」を選択してください。
        <span style="color: red">
          （テキストは下までスクロールしないと「同意します」は選択できません。）
        </span>
        <br />
        「同意しない」場合はアプリからログアウトします。
      </p>
      <div v-html="memberPledge.contents" class="contents" ref="container"></div>
      <div class="button-group">
        <v-ons-button modifier="outline" @click="disagree" class="button">
          同意しない
        </v-ons-button>
        <v-ons-button
          modifier="cta"
          @click="agree"
          :disabled="!isScrolled"
          class="button"
          style="flex-grow: 1.5"
        >
          同意する
        </v-ons-button>
      </div>
    </div>
  </v-ons-dialog>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false,
    };
  },
  computed: {
    memberPledge: function () {
      return this.$store.getters['ccardApplication/memberPledge'];
    },
  },
  created: async function () {},
  methods: {
    /**
     * 同意する
     */
    agree: function () {
      this.$emit('agree');
      this.closeDialog();
    },
    /**
     * ダイアログを閉じる
     */
    closeDialog: function () {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 同意しない
     */
    disagree: function () {
      this.$emit('disagree');
      this.closeDialog();
    },
    /**
     * スクロール位置をチェックする
     */
    checkScroll: function () {
      const container = this.$refs.container;
      if (container)
        this.isScrolled =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      if (this.$refs.container) {
        this.$refs.container.addEventListener('scroll', this.checkScroll);
      }
    });
  },
  name: 'MemberPledgeDialog',
  props: {
    dialogVisible: Boolean,
  },
};
</script>

<style scoped>
:deep(.dialog) {
  width: 100vw;
  height: 95vh;
}

.button {
  margin: 0 1rem;
}

.button-group {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-around;
  text-align: center;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.explain {
  font-size: 0.8rem;
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2% 5%;
  height: 100%;
}

.contents {
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  overflow: auto;
  flex-grow: 1;
}

.update-message {
  margin: 0 auto 0.5rem auto;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
}
</style>
