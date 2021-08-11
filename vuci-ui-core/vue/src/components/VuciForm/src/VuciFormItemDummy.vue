<template>
  <vuci-form-item-template v-bind="VuciFormItemTemplateProps">
    <slot name="prepend"/>
    <span>{{ model }}</span>
    <slot name="append"/>
  </vuci-form-item-template>
</template>

<script>
import VuciFormItemMixin from './VuciFormItemMixin.vue'

export default {
  name: 'VuciFormItemDummy',
  mixins: [VuciFormItemMixin],
  methods: {
    __save () {
    }
  }
}
</script>
