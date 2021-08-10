<template>
  <component :is="container" :title="title">
    <slot v-if="section"  v-bind:s="section"/>
  </component>
</template>

<script>
import VuciSection from './VuciSection.vue'

export default {
  name: 'VuciNamedSection',
  mixins: [VuciSection],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      sections: []
    }
  },
  computed: {
    section () {
      return this.sections.length > 0 ? this.sections[0] : null
    }
  },
  methods: {
    load () {
      this.sections = this.$uci.sections(this.config).filter(s => s['.name'] === this.name)
    }
  },
  watch: {
    loaded () {
      this.load()
    }
  }
}
</script>
