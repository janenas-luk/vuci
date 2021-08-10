<template>
   <vuci-form uci-config="rtty">
    <vuci-typed-section type="rtty" addremove :collabsible="false" v-slot="{ s }">
      <vuci-form-item-select :uci-section="s" :label="$t('rtty.Interface')" name="interface" :options="interfaces"/>
      <vuci-form-item-input :uci-section="s" label="ID" name="id"/>
      <vuci-form-item-input :uci-section="s" :label="$t('rtty.Description')" name="description"/>
      <vuci-form-item-input :uci-section="s" :label="$t('rtty.Host')" name="host" required/>
      <vuci-form-item-input :uci-section="s" :label="$t('rtty.Port')" name="port" placeholder="5912" rules="port"/>
      <vuci-form-item-switch :uci-section="s" label="SSL" name="ssl"/>
      <vuci-form-item-input :uci-section="s" :label="$t('rtty.Token')" name="token"/>
    </vuci-typed-section>
  </vuci-form>
</template>

<script>
export default {
  data () {
    return {
      interfaces: []
    }
  },
  created () {
    this.$network.load().then(() => {
      const interfaces = this.$network.getInterfaces()
      this.interfaces.push(...interfaces.map(item => item.name))
    })
  }
}
</script>
