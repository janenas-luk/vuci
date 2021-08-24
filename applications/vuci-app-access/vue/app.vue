<template>
<div>
  <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="SSH">
        <a-form :label-col="{ span:8 }" :wrapper-col="{ span: 6 }">
          <a-form-item label="Enable SSH access">
            <a-switch v-model="ssh.lan" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item  v-if="ssh.lan" label="Enable Remote SSH access">
            <a-switch v-model="ssh.wan.enabled" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item label="Port">
            <a-input v-model="ssh.port"/>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="WEB UI">
        <a-form :label-col="{ span:8 }" :wrapper-col="{ span: 6 }">
          <a-form-item label="Enable HTTP access">
            <a-switch v-model="uhttpd.http" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item label="Enable HTTPS access">
            <a-switch v-model="uhttpd.https" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item v-if="uhttpd.http" label="Enable Remote HTTP access">
            <a-switch v-model="webui.wanHTTP.enabled" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item v-if="uhttpd.http" label="Port">
            <a-input v-model="webui.wanHTTP.port"/>
          </a-form-item>
          <a-form-item v-if="uhttpd.https" label="Enable Remote HTTPS access">
            <a-switch v-model="webui.wanHTTPS.enabled" checked-children="1" un-checked-children="0"/>
          </a-form-item>
          <a-form-item v-if="uhttpd.https" label="Port">
            <a-input v-model="webui.wanHTTPS.port"/>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
  </a-collapse>
  <div style="display:flex; justify-content: flex-end; margin:2rem;">
    <a-button @click="handleSubmit" style="margin-right: 0.5rem;" type="primary">Save & Apply</a-button>
    <a-button type="danger">Reset</a-button>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      LastChangedConfig: '',
      ssh: {
        cfg: '',
        lan: '',
        wan: {
          enabled: false,
          cfg: null
        },
        port: '22'
      },
      webui: {
        wanHTTP: {
          cfg: null,
          enabled: false,
          port: '80'
        },
        wanHTTPS: {
          cfg: null,
          enabled: false,
          port: '443'
        }
      },
      uhttpd: {
        http: true,
        https: true
      },
      activeKey: ['1']
    }
  },
  methods: {
    async handleSubmit () {
      this.$store.commit('spin', 'Saving access control settings')
      await this.saveSSHData()
      await this.saveWebuiData()
      await this.saveUhttpdData()
      await this.$uci.save()
      await this.$uci.apply()
      this.$system.initRestart('firewall')
      this.$store.commit('spin', false)
    },
    async saveSSHData () {
      await this.$uci.load('dropbear')
      this.$uci.set('dropbear', this.ssh.cfg, 'enable', this.ssh.lan === true ? '1' : '0')
      this.$uci.set('dropbear', this.ssh.cfg, 'Port', this.ssh.port)
      await this.$uci.load('firewall')
      this.$uci.set('firewall', this.ssh.wan.cfg, 'enabled', this.ssh.wan.enabled === true ? '1' : '0')
    },
    async saveWebuiData () {
      await this.$uci.load('firewall')
      if (!this.uhttpd.http) { this.webui.wanHTTP.enabled = false }
      if (!this.uhttpd.https) { this.webui.wanHTTPS.enabled = false }
      this.$uci.set('firewall', this.webui.wanHTTP.cfg, 'enabled', this.webui.wanHTTP.enabled === true ? '1' : '0')
      this.$uci.set('firewall', this.webui.wanHTTP.cfg, 'dest_port', this.webui.wanHTTP.port)
      this.$uci.set('firewall', this.webui.wanHTTPS.cfg, 'enabled', this.webui.wanHTTPS.enabled === true ? '1' : '0')
      this.$uci.set('firewall', this.webui.wanHTTPS.cfg, 'dest_port', this.webui.wanHTTPS.port)
    },
    async saveUhttpdData () {
      await this.$uci.load('uhttpd')
      this.$uci.set('uhttpd', 'main', 'enable_http', this.uhttpd.http === true ? '1' : '0')
      this.$uci.set('uhttpd', 'main', 'enable_https', this.uhttpd.https === true ? '1' : '0')
      this.$uci.set('uhttpd', 'main', '_httpsWanAccess', this.webui.wanHTTPS.enabled === true ? '1' : '0')
    },
    async addFirewallSection (port, name) {
      await this.$uci.load('firewall')
      const sid = this.$uci.add('firewall', 'rule')
      this.$uci.set('firewall', sid, 'dest_port', port)
      this.$uci.set('firewall', sid, 'proto', 'tcp')
      this.$uci.set('firewall', sid, 'name', `Enable_${name}_WAN`)
      this.$uci.set('firewall', sid, 'target', 'ACCEPT')
      this.$uci.set('firewall', sid, 'src', 'wan')
      this.$uci.set('firewall', sid, 'enabled', '0')
      await this.$uci.save()
      await this.$uci.apply()
      return [sid, port]
    },
    checkForNulls () {
      if (!this.webui.wanHTTP.cfg) {
        [this.webui.wanHTTP.cfg, this.webui.wanHTTP.port] = this.addFirewallSection(80, 'HTTP')
      }
      if (!this.webui.wanHTTPS.cfg) {
        [this.webui.wanHTTP.cfg, this.webui.wanHTTP.port] = this.addFirewallSection(443, 'HTTPS')
      }
      if (!this.ssh.wan.cfg) {
        this.ssh.wan.cfg = this.addFirewallSection(22, 'SSH')
      }
    },
    async loadFirewallSettings () {
      await this.$uci.load('firewall')
      this.$uci.sections('firewall', 'rule').forEach(rule => {
        switch (rule.name) {
          case 'Enable_SSH_WAN':
            this.ssh.wan.enabled = rule.enabled === '1'
            this.ssh.wan.cfg = rule['.name']
            break
          case 'Enable_HTTPS_WAN':
            this.webui.wanHTTPS.enabled = rule.enabled === '1'
            this.webui.wanHTTPS.port = rule.dest_port
            this.webui.wanHTTPS.cfg = rule['.name']
            break
          case 'Enable_HTTP_WAN':
            this.webui.wanHTTP.enabled = rule.enabled === '1'
            this.webui.wanHTTP.port = rule.dest_port
            this.webui.wanHTTP.cfg = rule['.name']
            break
          default:
            break
        }
      })
      this.checkForNulls()
    }
  },
  async created () {
    await this.$uci.load('dropbear')
    this.ssh.cfg = this.$uci.sections('dropbear')[0]['.name']
    this.ssh.lan = this.$uci.sections('dropbear')[0].enable === '1'
    this.ssh.port = this.$uci.sections('dropbear')[0].Port
    this.loadFirewallSettings()
    await this.$uci.load('uhttpd')
    this.uhttpd.http = this.$uci.get('uhttpd', 'main', 'enable_http') === '1'
    this.uhttpd.https = this.$uci.get('uhttpd', 'main', 'enable_https') === '1'
  },
  watch: {
    ssh: {
      handler (val) {
        if (!val.lan) {
          this.ssh.wan.enabled = false
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
