<template>
  <div style="display: flex" @mouseenter="showDelBtn = true" @mouseleave="showDelBtn = false">
    <div style="width: 100%; margin-right: 10px"><slot/></div>
    <a-button v-if="addremove" :style="{visibility: delBtnStyle}" type="danger" size="small" @click="handleDel">{{ $t('Delete') }}</a-button>
  </div>
</template>

<script>
export default {
  name: 'VuciTypedSectionBody',
  inject: ['vuciSection'],
  props: {
    sid: String
  },
  data () {
    return {
      showDelBtn: false
    }
  },
  computed: {
    addremove () {
      return this.vuciSection.addremove
    },
    delBtnStyle () {
      return this.showDelBtn ? 'visible' : 'hidden'
    }
  },
  methods: {
    handleDel () {
      this.vuciTypedSection.delSection(this.sid)
    }
  }
}
</script>
