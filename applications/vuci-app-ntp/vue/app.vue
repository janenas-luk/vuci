<template>
  <div class="box">
      <div class="section">
        <h1 class="section-header">
            NTP Client
        </h1>
        <form class="section-body" >
          <div class="field">
            <label class="field-label" for="enable">Enable NTP Client</label>
            <div class="field-input">
              <input type="checkbox" v-model="ntpClient.enabled">
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="enable">Force Servers</label>
            <div class="field-input">
              <input type="checkbox" v-model="ntpClient.forceServers">
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="enable">Offset frequency</label>
            <div class="field-input">
              <input type="text" v-model="ntpClient.offsetFreq.value" class="input">
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="enable">Update Interval (in seconds)</label>
            <div class="field-input">
              <input type="text" v-model="ntpClient.interval" class="input">
            </div>
          </div>
        </form>
      </div>
      <div class="section">
        <h1 class="section-header">
          Time Servers
        </h1>
        <div class="section-body">
          <ul>
            <li v-for="(server, index) in timeServers" :key="server.hostname + index" class="list-item">
              <div class="has-addons">
                <input v-model="server.hostname" type="text" class="input" placeholder="my.host.example.com">
                <input v-model="server.port" class="input w-64" type="text" placeholder="port">
              </div>
              <button role="button" class="button primary" @click="removeTimeServer(index)"> &#10006; </button>
            </li>
            <li add :key="timeServers.length" class="list-item">
              <button class="button primary" @click="addTimeServer()">ADD</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="section">
        <h1 class="section-header">
          NTP Server
        </h1>
        <div class="section-body">
          <div class="field">
            <label class="field-label" for="enable">Enable NTP Server</label>
            <div class="field-input">
              <input v-model="ntpServer" type="checkbox" >
            </div>
          </div>
        </div>
      </div>
      <button @click="saveNtpSettings" class="button primary right">Save & Apply</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ntpClient: {
        enabled: '',
        forceServers: '',
        offsetFreq: {
          value: '',
          name: ''
        },
        interval: ''
      },
      ntpServer: '',
      timeServers: []
    }
  },
  methods: {
    getNtpServer () {
      this.$uci.load('ntpserver').then((res) => {
        this.ntpServer = this.$uci.get('ntpserver', 'general', 'enabled') === '1'
      })
    },
    async getNtpClient () {
      await this.$uci.load('ntpclient')
      this.$uci.sections('ntpclient').forEach(object => {
        switch (object['.type']) {
          case 'ntpserver':
            this.timeServers.push(object)
            break
          case 'ntpdrift':
            this.ntpClient.offsetFreq.value = object.freq
            this.ntpClient.offsetFreq.name = object['.name']
            break
          default:
            this.ntpClient.enabled = object.enabled === '1'
            this.ntpClient.name = object['.name']
            this.ntpClient.interval = object.interval
            this.ntpClient.forceServers = object.force === '1'
            break
        }
      })
    },
    addTimeServer () {
      this.timeServers.push({ hostname: '', port: '' })
    },
    removeTimeServer (index) {
      this.$delete(this.timeServers, index)
    },
    async saveNtpSettings () {
      this.$store.commit('spin', 'Applying NTP changes')
      await this.$uci.load('ntpclient')
      this.$uci.sections('ntpclient', 'ntpserver').forEach(object => {
        this.$uci.del('ntpclient', object['.name'])
      })
      this.timeServers.forEach(server => {
        if (server.hostname && server.port) {
          const name = this.$uci.add('ntpclient', 'ntpserver')
          this.$uci.set('ntpclient', name, 'hostname', server.hostname)
          this.$uci.set('ntpclient', name, 'port', server.port)
        }
      })
      this.$uci.set('ntpclient', this.ntpClient.name, 'enabled', this.ntpClient.enabled === true ? 1 : 0)
      this.$uci.set('ntpclient', this.ntpClient.name, 'interval', this.ntpClient.interval)
      this.$uci.set('ntpclient', this.ntpClient.offsetFreq.name, 'freq', this.ntpClient.offsetFreq.value)
      this.$uci.set('ntpclient', this.ntpClient.name, 'force', this.ntpClient.forceServers === true ? 1 : 0)
      await this.$uci.load('ntpserver')
      console.log(this.$uci.get('ntpserver', 'general', 'enabled'))
      this.$uci.set('ntpserver', 'general', 'enabled', this.ntpServerValue)
      console.log(this.$uci.get('ntpserver', 'general', 'enabled'))
      await this.$uci.save()
      await this.$uci.apply().then(() => { this.$store.commit('spin', false) })
      // this.$store.commit('spin', false)
    }
  },
  created () {
    this.getNtpClient()
    this.getNtpServer()
  },
  computed: {
    ntpServerValue () {
      return this.ntpServer === true ? 1 : 0
    }
  }
}
</script>

<style>
.ghost {
  background: rgba(0,0,0,0.07) !important;
  text-decoration: underline dotted #2a52be;
  color: #2a52be;
}
.ghost:hover {
  background: rgba(0,0,0,0.13) !important;
}
.w-64 {
  width: 64px !important;
}
.right {
  align-self: flex-end;
  margin: 1rem 1rem;
}
.box {
  display: flex;
  box-sizing: border-box;
  flex-flow: column nowrap;
  max-width: 1400px;
  min-width: 500px;
  margin: 2rem;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 1rem;
}
.section {
  padding: 1rem 2rem;
}
.section-header {
  margin: 0.5rem 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.5);
}
.section-body {
  margin: 0.5rem 0rem;
  display: flex;
  flex-flow:column nowrap;
}
.has-addons {
  transition: unset !important;
  display: flex;
  max-width: 200px;
  justify-content: flex-start;
}
.has-addons > .input {
  margin-right: 0;
  width: 180px;
}
.has-addons > .input:first-child {
  border-radius: 0.5rem 0 0 0.5rem;
}
.has-addons > .input:last-child {
  border-radius: 0 0.5rem 0.5rem 0;
}
.field {
  display:flex;
  flex-flow: row nowrap;
  align-content: center;
  justify-content:center;
}
.field-label {
  width: 200px;
  flex-grow: 1;
  flex-shrink: 2;
  font-weight: 500;
  text-align: right;
  margin: 0.5rem 1rem;
}
.input {
  flex-grow: 1;
  border-radius: 0.5rem;
  max-width: 40ch;
  width: 40ch;
  border: 1px solid rgba(0,0,0,0.4);
  padding: 0.2rem 0.5rem;
  transition: all 100ms ease-in;
}
input:focus {
  outline: unset;
  border: 1px solid rgba(82, 168, 236, 0.8) !important;
  box-shadow: 0px 0px 5px 2px rgba(82, 169, 236, 0.5);
}
input:hover {
  border: 1px solid rgba(0,0,0,0.6);
}
.field-input {
  width: 400px;
  flex-grow: 1;
  align-self: center;
  margin: 0.2rem;
}
.list-item {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.4);
  display: flex;
  justify-content: space-between;
  transition: all 500ms;
}
.list-item:hover {
  background-color: rgba(82, 168, 236, 0.1);
}
.button {
  cursor: pointer;
  max-width: 175px;
  border:none;
  background: white;
  border-radius: 1rem;
  padding: 0.35rem 0.7rem;
  transition: all 100ms ease-in;
}
.primary {
  border: 1px solid #2a52be !important;
  color: #2a52be !important;
}
.primary:hover{
  background: #2a52be !important;
  color: white !important;
  font-weight: 400;
  letter-spacing: 0px;
}

@media all and (max-width:900px) {
.field-label {
  text-align: left;
}
.field {
  flex-flow: row wrap;
}
}
</style>
