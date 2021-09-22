<template>
  <div>
    <a-form-item label="TYPE">
      <a-input :value="this.form.type" disabled/>
    </a-form-item>
    <a-form-item label="Enable">
      <a-switch v-model="form.enable"/>
    </a-form-item>
    <a-form-item label="TUN/TAP">
      <a-select v-model="form.dev" placeholder="Device type">
        <a-select-option v-for="type in deviceType" :key="type.value" :value="type.value"> {{ type.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Protocol">
      <a-select v-model="form.proto">
        <a-select-option v-for="protocol in protocols" :key="protocol.value">{{ protocol.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Port">
      <a-input v-model="form.port"/>
    </a-form-item>
    <a-form-item label="LZO">
      <a-switch v-model="form.comp_lzo"/>
    </a-form-item>
    <a-form-item label="Encryption">
      <a-select v-model="form.cipher">
        <a-select-option v-for="cipher in authAlgorithms" :key="cipher.value" :value="cipher.value">{{ cipher.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Authentication">
      <a-select @change="handleAuthChange" v-model="form._auth">
        <a-select-option v-for="method in authMethods" :key="method.value" :value="method.value">{{ method.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Remote host/IP address">
      <a-input placeholder="0.0.0.0" v-model="form.remote"/>
    </a-form-item>
    <a-form-item label="Resolve retry">
      <a-input v-model="form.resolv_retry"/>
    </a-form-item>
    <a-form-item label="Keep alive">
      <a-input v-model="form.keepalive"/>
    </a-form-item>
    <a-form-item label="Remote network IP address">
      <a-input placeholder="0.0.0.0" v-model="form.route[0]"/>
    </a-form-item>
    <a-form-item label="Remote network IP netmask">
      <a-input placeholder="255.255.255.0" v-model="form.route[1]"/>
    </a-form-item>
    <span v-if="form._auth === 'skey'">
      <a-form-item label="Local tunnel endpoint IP">
      <a-input placeholder="172.16.0.2" v-model="form.ifconfig[0]"/>
    </a-form-item>
    <a-form-item label="Remote tunnel endpoint IP">
      <a-input placeholder="172.16.0.1" v-model="form.ifconfig[1]"/>
    </a-form-item>
    <a-form-item label="Static pre-shared key">
      <a-upload
      :beforeUpload="checkForFolder"
      ref="upload"
      action="/upload"
      @change="watchProgress"
      :data="{path: uploadPath('secret')}">
        <a-button><a-icon type="upload" /> Upload</a-button>
      </a-upload>
    </a-form-item>
    </span>
    <span v-else>
      <a-form-item label="TLS cipher">
        <a-select v-model="form._tls_cipher">
          <a-select-option value="all">All</a-select-option>
          <a-select-option value="dhe_rsa">DHE + RSA</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Authentication algorithm">
        <a-select v-model="form.auth">
          <a-select-option value="sha1">SHA1 (default)</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Extra options">
        <a-select v-model="form._extra" mode="tags"></a-select>
      </a-form-item>
      <a-form-item label="Certificate authority">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'ca')"
        :data="{path: uploadPath('ca')}">
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
      <a-form-item label="Client certificate">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'cert')"
        :data="{path: uploadPath('cert')}">
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
      <a-form-item label="Client Key">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'key')"
        :data="{path: uploadPath('key')}"
        >
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
    </span>
    <a-form-item>
        <a-button @click="saveConfiguration" type="primary">Save & Apply</a-button>
      </a-form-item>
  </div>
</template>
<script>

import FormMixin from './FormMixin'

export default {
  mixins: [FormMixin],
  props: ['configName', 'edit', 'type'],
  name: 'ClientForm',
  data () {
    return {
      form: {
        resolv_retry: 'infinite'
      }
    }
  },
  created () {
    this.additionalParams.push({
      name: 'nobind',
      value: 1
    })
  }
}
</script>
