<template>
  <vuci-form-item-template v-bind="VuciFormItemTemplateProps">
    <a-upload :file-list="fileList" action="/upload" :data="{path: path + fileName}" @change="onUpload" :beforeUpload="beforeUpload" :remove="remove">
      <a-button type="primary"><a-icon type="upload" /> Upload</a-button>
    </a-upload>
  </vuci-form-item-template>
</template>

<script>
import VuciFormItemMixin from './VuciFormItemMixin'

export default {
  name: 'VuciFormItemUpload',
  mixins: [VuciFormItemMixin],
  props: {
    // Location where uploaded files will be stored
    path: {
      type: String,
      default: '/etc/vuci-uploads/'
    },
    // Size limit of uploaded files
    size: {
      type: [Number, String],
      default: 10000
    },
    // Set true to allow uploading multiple files
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileName: '',
      fileNameDisplay: '',
      fileList: [],
      deleteList: []
    }
  },
  methods: {
    beforeUpload (file) {
      this.fileNameDisplay = file.name
      this.fileName = file.uid + '.' + file.name
    },
    onUpload (info) {
      const file = info.file
      const status = file.status

      if (file.size > this.size) {
        this.$message.error(`File size exceeds ${this.size}B limit.`)
        return
      }

      if (!this.multiple && info.fileList.length > 1) {
        this.$message.error('You can only upload one file.')
        return
      }

      this.fileList = info.fileList

      if (status === 'uploading' || status === 'removed') return

      if (status !== 'done') {
        this.$message.error(`upload '${this.fileNameDisplay}' failed.`)
        return
      }

      this.$message.success(`File '${this.fileNameDisplay}' uploaded.`)
      if (this.multiple) this.model = this.fileList.map(f => this.path + f.uid + '.' + f.name)
      else this.model = this.path + file.uid + '.' + file.name
    },
    remove (file) {
      this.deleteList.push(file)
      this.fileList = this.fileList.filter(f => f.uid !== file.uid)
      if (this.multiple) this.model = this.fileList.map(f => this.path + f.uid + '.' + f.name)
      else this.model = undefined
    },
    getFiles () {
      let files = this.$uci.get(this.config, this.sid, this.name)
      if (!files) return
      if (!Array.isArray(files)) files = [files]
      files.forEach(f => {
        this.$rpc.ubus('file', 'stat', { path: f }).then(r => {
          if (!r) return
          const fileName = f.split('\\').pop().split('/').pop()
          const parts = fileName.split('.')
          const uid = parts.shift()
          const name = parts.join('.')
          this.fileList.push({ uid, name })
        })
      })
    },
    changed () {
      if (this.multiple) {
        if (!this.model && !this.initialValue) return false
        if (this.model && !this.initialValue) return true
        if (this.model.length !== this.initialValue.length) return true
        for (let i = 0; i < this.model.length; i++) {
          if (this.model[i] !== this.initialValue[i]) return true
        }
        return false
      } else {
        return this.model !== this.initialValue
      }
    },
    __save () {
      if (this.changed()) {
        if (this.save) { return this.save(this) }

        this.$uci.set(this.config, this.sid, this.name, this.model)

        this.deleteList.forEach(f => this.$rpc.ubus('file', 'remove', { path: this.path + f.uid + '.' + f.name }))
        this.deleteList = []
      }
    }
  },
  created () {
    this.getFiles()
  }
}
</script>
