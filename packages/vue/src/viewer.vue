<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script>
import { getProcessor } from 'bytemd';

export default {
  props: ['value', 'plugins', 'sanitize'],
  computed: {
    html() {
      return this.result.toString();
    },
    result() {
      return getProcessor(this.$props).processSync(this.$props.value);
    },
    needUpdate() {
      return [this.result, this.plugins, this.sanitize];
    },
  },
  watch: {
    needUpdate: {
      handler(val) {
        this.off();
        this.$nextTick(() => {
          this.on();
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.on();
  },
  beforeDestroy() {
    this.off();
  },
  methods: {
    on() {
      if (this.plugins) {
        this.cbs = this.plugins.map(
          ({ viewerEffect }) =>
            viewerEffect && viewerEffect({ $el: this.$el, result: this.result })
        );
      }
    },
    off() {
      if (this.cbs) {
        this.cbs.forEach((cb) => cb && cb());
      }
    },
  },
};
</script>
