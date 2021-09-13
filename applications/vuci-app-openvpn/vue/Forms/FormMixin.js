import select from './selects'

export default {
  data () {
    return {
      authMethods: select.authMethods,
      authAlgorithms: select.authAlgorithms,
      connectionType: select.connectionType,
      protocols: select.protocols,
      form: {
        type: '',
        _name: '',
        enable: false,
        keepalive: '10 120',
        port: '1194',
        _auth: 'skey',
        cipher: 'BF-CBC',
        proto: 'udp',
        dev: '',
        comp_lzo: false,
        ifconfig: ['', ''],
        route: ['', '']
      },
      folderCreated: false,
      additionalParams: []
    }
  },
  computed: {
    deviceType () {
      return this.connectionType.map(element => {
        return {
          name: element.name,
          value: `${element.value}_${this.form.type[0]}_${this.configName}`
        }
      })
    }
  },
  methods: {
    async checkForFolder () {
      if (!this.folderCreated) {
        await this.$rpc.call('file', 'makeDirectory', { path: `/etc/openvpn/keys/${this.form._name}` })
        this.folderCreated = true
      }
    },
    handleAuthChange (changed) {
      const staticKeys = ['ifconfig', 'secret']
      const tlsKeys = ['ca', 'cert', 'dh', 'key', '_server', 'push',
        'server', 'duplicate_cn', 'client_to_client', '_tls_cipher', 'auth']
      if (changed === 'skey') {
        this.form.ifconfig = ['', '']
        this.form.route = ['', '']
        tlsKeys.slice(0, 3).forEach(extension => this.checkForKeys(extension))
        tlsKeys.forEach(key => this.$delete(this.form, key))
      }
      if (changed === 'tls') {
        this.checkForKeys('static')
        staticKeys.forEach(key => this.$delete(this.form, key))
        this.form.auth = 'sha1'
        this.form.server = ['', '']
        this.form._tls_cipher = 'all'
      }
    },
    checkForKeys (extension) {
      if (this.form[extension]) {
        this.$rpc.call('file', 'remove', { path: this.form[extension] }).then(() => {
          this.form[extension] = ''
        })
      }
    },
    watchProgress ({ file }, extension) {
      if (file.response === 'OK' && file.status === 'done') {
        this.form[extension] = this.uploadPath(extension)
      }
      if (file.status === 'removed') {
        this.checkForKeys(extension)
      }
    },
    uploadPath (extension) {
      const path = `/etc/openvpn/keys/${this.form._name}/openvpn.${this.form._name}.${extension}`
      return path
    },
    editConfig (vpn) {
      Object.keys(vpn).forEach(key => {
        let val = vpn[key]
        if (val === '1' || val === '0' || val === 'yes' || val === 'no') {
          val = (val === '1' || val === 'yes')
        }
        if (key === 'route' || key === 'ifconfig') {
          this.form[`_${key}`] = val.split(' ')[0]
          this.form[key] = val.split(' ')[1]
        } else if (val !== 'undefined') {
          this.form[key] = val
        }
      })
      this.configName = this.form._name
      this.showForm = true
      this.edit = true
    },
    addVPNSection () {
      this.$uci.set('openvpn', this.form._name, 'persist_key', 1)
      this.$uci.set('openvpn', this.form._name, 'persist_tun', 1)
      this.$uci.set('openvpn', this.form._name, 'verb', 5)
      this.$uci.set('openvpn', this.form._name, 'type', this.form.for)
      this.$uci.set('openvpn', this.form._name, '_name', this.form._name)
      this.$uci.set('openvpn', this.form._name, 'status', `/tmp/openvpn-status_${this.form._name}.log`)
      if (this.additionalParams) {
        this.additionalParams.forEach(parameter => {
          this.$uci.set('openvpn', this.form._name, parameter.name, parameter.value)
        })
      }
    },
    async saveConfiguration () {
      this.$spin()
      await this.$uci.load('openvpn')
      if (!this.edit) {
        await this.$uci.add('openvpn', 'openvpn', this.form._name)
        this.addVPNSection()
      }
      Object.keys(this.form).forEach(key => {
        if (typeof this.form[key] === 'boolean') {
          this.form[key] = this.form[key] ? '1' : '0'
          if (key === 'comp_lzo') {
            this.form[key] = this.form[key] ? 'yes' : 'no'
          }
        }
        if (Array.isArray(this.form[key])) {
          const line = this.form[key].join(' ')
          if (!this.isEmptyString(line)) {
            this.$uci.set('openvpn', this.configName, key, this.form[key].join(' '))
          }
          return
        }
        this.$uci.set('openvpn', this.configName, key, this.form[key])
      })
      if (this.form.type === 'client' && this.form._auth === 'tls') {
        this.$uci.set('openvpn', this.configName, 'tls_client', 1)
        this.$uci.set('openvpn', this.configName, 'client', 1)
      }
      this.$firewall.addVpnConfig(this.form.port)
      await this.$uci.save()
      await this.$uci.apply()
      await this.$system.initReload('firewall')
      await this.$system.initReload('openvpn')
      Object.keys(this.form).map(key => { this.form[key] = '' })
      this.$emit('done')
      this.$store.commit('spin', false)
    },
    isEmptyString (string) {
      let whiteSpaces = 0
      for (const char of string) {
        if (char === ' ') {
          whiteSpaces++
        }
      }
      return whiteSpaces === string.length
    }
  },
  created () {
    this.form.type = this.type
    this.form._name = this.configName
    this.form.dev = this.deviceType[0].value
    if (this.edit) {
      this.editConfig(this.editable)
    }
  }
}
