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
    <a-form-item label="Authentication">
      <a-select @change="handleAuthChange" v-model="form._auth">
        <a-select-option v-for="method in authMethods" :key="method.value" :value="method.value">{{ method.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Encryption">
      <a-select v-model="form.cipher">
        <a-select-option v-for="cipher in authAlgorithms" :key="cipher.value" :value="cipher.value">{{ cipher.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <span v-if="form._auth === 'skey'">
      <a-form-item label="Local tunnel endpoint IP">
        <a-input placeholder="172.16.0.1" v-model="form.ifconfig[0]"/>
      </a-form-item>
      <a-form-item label="Remote tunnel endpoint IP">
        <a-input placeholder="172.16.0.2" v-model="form.ifconfig[1]"/>
      </a-form-item>
      <a-form-item label="Remote network IP address">
        <a-input placeholder="0.0.0.0" v-model="form.route[0]"/>
      </a-form-item>
      <a-form-item label="Remote network IP netmask">
        <a-input placeholder="255.255.255.0" v-model="form.route[1]"/>
      </a-form-item>
      <a-form-item label="Static pre-shared key">
        <a-upload
        :beforeUpload="checkForFolder"
        action="/upload"
        @change="watchProgress($event, 'secret')"
        :data="{path: uploadPath('secret')}"
        ><a-button type="success"><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
    </span>
    <span v-else>
      <a-form-item label="TLS cipher">
        <a-select v-model="form._tls_cipher">
          <a-select-option value="all">All</a-select-option>
          <a-select-option value="dhe_rsa">DHE + RSA</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Client to Client">
        <a-switch v-model="form.client_to_client"></a-switch>
      </a-form-item>
      <a-form-item label="Keep alive">
        <a-input v-model="form.keepalive"/>
      </a-form-item>
      <a-form-item label="Virtual network IP address">
        <a-input placeholder="172.16.1.0" v-model="form.server[0]"></a-input>
      </a-form-item>
      <a-form-item label="Virtual network netmask">
        <a-input placeholder="255.255.255.0" v-model="form.server[1]"></a-input>
      </a-form-item>
      <a-form-item label="Push option">
        <a-select v-model="form.push" mode="tags" placeholder="route 192.168.1.0 255.255.255.0"></a-select>
      </a-form-item>
      <a-form-item label="Allow duplicate certificates">
        <a-switch v-model="form.duplicate_cn"></a-switch>
      </a-form-item>
      <a-form-item label="Authentication algorithm">
        <a-select v-model="form.auth">
          <a-select-option value="sha1">SHA1 (default)</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Certificate authority">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'ca')"
        :data="{path: uploadPath('ca')}">
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
      <a-form-item label="Server certificate">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'cert')"
        :data="{path: uploadPath('cert')}">
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
      <a-form-item label="Server key">
        <a-upload
        action="/upload"
        :beforeUpload="checkForFolder"
        @change="watchProgress($event, 'key')"
        :data="{path: uploadPath('key')}">
        <a-button><a-icon type="upload" /> Upload</a-button></a-upload>
      </a-form-item>
      <a-form-item label="Diffie Hellman parameters">
        <a-upload
        :beforeUpload="checkForFolder"
        action="/upload"
        @change="watchProgress($event, 'dh')"
        :data="{path: uploadPath('dh')}"
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
  name: 'ServerForm'
}
</script>
