<template>
  <div>
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="Command Line Interface">
        <iframe ref="iframe" src="" srcdoc="" frameborder="0"></iframe>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      url: '',
      port: '',
      pid: '',
      session: '',
      hostname: '192.168.1.1',
      activeKey: ['1']
    }
  },
  methods: {
    getCLIInstance () {
      this.$rpc.call('cliTrigger', 'runCLI').then(response => {
        const res = response[0]
        this.port = res['X-ShellInABox-Port']
        this.session = res['X-ShellInABox-Session']
        this.pid = res['X-ShellInABox-Pid']
        this.$refs.iframe.srcdoc = response[1]
      })
    }
  },
  async created () {
    this.getCLIInstance()
  },
  beforeDestroy () {
    this.$rpc.ubus('system', 'signal', { pid: this.pid, signum: 9 })
  }
}

</script>
<style scoped>
iframe {
  height: 600px;
  width: 100%;
}
</style>
