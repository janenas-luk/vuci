<template>
  <vuci-form-item-template v-bind="VuciFormItemTemplateProps">
    <slot :self="this"></slot>
  </vuci-form-item-template>
</template>

<script>
import VuciFormItemMixin from './VuciFormItemMixin.vue'

export default {
  name: 'VuciFormItem',
  mixins: [VuciFormItemMixin]
}
</script>
