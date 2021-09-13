<template>
  <div>
    <a-collapse style="width:90%; margin:auto" v-if="!showForm" v-model="activeKey">
      <a-collapse-panel key="1" header="OpenVPN configuration">
        <table class="data-table" v-if="vpns.length > 0">
          <thead>
            <tr>
              <th>Tunnel Name</th>
              <th>Role</th>
              <th>TUN/TAP</th>
              <th>Port</th>
              <th>Status</th>
              <th>On/Off</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vpn, index) in vpns" :key="vpn._name">
              <td>{{ vpn._name }}</td>
              <td>{{ vpn.type }}</td>
              <td>{{ vpn.dev }}</td>
              <td>{{ vpn.port }}</td>
              <td>Running</td>
              <td>
                <a-switch @change="toggleEnable(index)" size="small" v-model="vpn.enable"/>
              </td>
              <td>
                <a-button-group>
                <a-button title="Edit" @click="handleEdit(vpn)" shape="circle" icon="edit"/>
                <a-button title="Delete" @click="deleteConfiguration(vpn['.name'], index)" shape="circle" type="danger" icon="delete"/>
                </a-button-group>
              </td>
            </tr>
          </tbody>
        </table>
        <h4 v-else><em>There are no OpenVPN configurations yet</em></h4>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="Add new OpenVPN configuration">
        <a-form style="display:flex; justify-content:space-between" layout="inline" >
          <a-form-item label="New configuration name">
            <a-input v-model="form._name" placeholder="Example"/>
          </a-form-item>
          <a-form-item style="width:200px" label="Role">
            <a-select v-model="form.type" style="width:150px" placeholder="Choose a role">
              <a-select-option value="client">
                Client
              </a-select-option>
              <a-select-option value="server">
                Server
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button @click="addVPNConfig" :disabled="form._name.length <= 1 || form._name.length > 8" type="primary">Add</a-button>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
    </a-collapse>
    <div v-if="showForm">
      <h2 style="margin:auto;">OpenVPN configuration for {{ configName }}</h2>
      <a-form :wrapper-col="{ span:10 }" :label-col="{ span:8 }">
        <component
        :is="whichForm"
        :configName="configName"
        :type="form.type"
        :edit="edit"
        :editable="selected"
        @done="loadVPNS"
        ></component>
      </a-form>
    </div>
  </div>
</template>

<script>
import ClientForm from './Forms/ClientForm.vue'
import ServerForm from './Forms/ServerForm.vue'
export default {
  components: { ClientForm, ServerForm },
  data () {
    return {
      selected: null,
      form: {
        type: 'client',
        _name: ''
      },
      edit: false,
      vpns: [],
      showForm: false,
      activeKey: ['1', '2'],
      configName: ''
    }
  },
  methods: {
    async loadVPNS () {
      await this.$uci.load('openvpn')
      this.showForm = false
      this.vpns = []
      this.$uci.sections('openvpn', 'openvpn').forEach(element => {
        element.enable = element.enable === '1'
        this.vpns.push(element)
      })
    },
    addVPNConfig () {
      this.configName = this.form._name
      this.showForm = true
    },
    async deleteConfiguration (sid, index) {
      this.$spin()
      await this.$uci.load('openvpn')
      this.$rpc.call('file', 'remove', { path: `/var/etc/openvpn-${sid}.conf` })
      this.$rpc.call('file', 'removeWildcard', { path: `/etc/openvpn/keys/${sid}` })
      this.$uci.del('openvpn', sid)
      this.$delete(this.vpns, index)
      await this.$uci.save()
      await this.$uci.apply()
      this.$store.commit('spin', false)
    },
    async toggleEnable (index) {
      const vpn = this.vpns[index]
      await this.$uci.load('openvpn')
      this.$uci.set('openvpn', vpn._name, 'enable', vpn.enable === true ? '1' : '0')
      await this.$uci.save()
      await this.$uci.apply()
      await this.$system.initReload('openvpn')
    },
    handleEdit (of) {
      this.edit = true
      this.form.type = of.type
      this.configName = of._name
      this.selected = of
      this.showForm = true
    }
  },
  computed: {
    whichForm () {
      return this.form.type + '-form'
    }
  },
  created () {
    this.loadVPNS()
  }
}
</script>
<style scoped>

.data-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.data-table thead {
  border-bottom: 2px solid rgba(0,0,0,0.35);
}
.data-table tbody > tr:hover {
  background: rgba(0,0,0,0.07);
}
</style>
