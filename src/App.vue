<template>
  <div>
    <splitter></splitter>
  </div>
</template>

<script>
import splitter from '@/components/Splitter.vue';

export default {
  components: {
    splitter,
  },
  name: 'App',
  mounted: function () {
    // this.$logger.trace(`[${this.$options.name}-mounted] trace`);
    // this.$logger.debug(`[${this.$options.name}-mounted]debug`);
    // this.$logger.info(`[${this.$options.name}-mounted]info`);
    // this.$logger.warn(`[${this.$options.name}-mounted]warn`);
    // this.$logger.error(`[${this.$options.name}-mounted]error`);
    // this.$logger.fatal(`[${this.$options.name}-mounted]fatal`);
  },
};
</script>
