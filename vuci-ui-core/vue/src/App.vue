<template>
  <a-config-provider id="app" :locale="locale">
    <fullscreen ref="fullscreen">
      <a-spin v-if="loaded" :spinning="spinning > 0" :tip="spintip || $t('Loading...')" size="large">
        <my-modal :key="counter" v-if="visible">
          <a-form>
          <a-form-item label="New password">
            <a-input-password v-model="pass"></a-input-password>
          </a-form-item>
          <a-form-item label="Confirm new password">
            <a-input-password v-model="passConfirm"></a-input-password>
          </a-form-item>
        </a-form>
        <template v-slot:footer>
            <a-button :disabled="passConfirm !== pass" type="primary" @click="handleSubmit">Confirm change</a-button>
        </template>
        <template v-slot:header>Set your new password</template>
        </my-modal>
        <router-view></router-view>
      </a-spin>
    </fullscreen>
    <left-side-bar></left-side-bar>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
import zhTW from 'ant-design-vue/es/locale-provider/zh_TW'
import jaJP from 'ant-design-vue/es/locale-provider/ja_JP'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      counter: 1,
      pass: '',
      passConfirm: '',
      visible: false,
      loaded: false,
      locales: {
        'zh-cn': zhCN,
        'zh-tw': zhTW,
        ja: jaJP
      }
    }
  },
  computed: {
    locale () {
      return this.locales[this.$i18n.locale]
    },
    ...mapState(['fullscreen', 'spinning', 'spintip'])
  },
  watch: {
    fullscreen () {
      this.$refs.fullscreen.toggle()
    },
    $route (to, from) {
      this.showModal()
    }
  },
  methods: {
    showModal () {
      if (this.$store.getters.passwordConfirmed === false) {
        console.log('turetu rodyti')
        this.counter++
        this.visible = true
      }
    },
    handleSubmit () {
      if (this.pass === this.passConfirm) {
        this.$rpc.call('ui', 'first_set', {
          lang: 'en',
          username: 'admin',
          password: this.pass
        }).then(() => {
          this.$router.push('/')
          this.$uci.save()
          this.visible = false
          this.$store.commit('setPasswordConfirmed', true)
          sessionStorage.setItem('__vuci_first_login', 'false')
        })
      }
    }
  },
  created () {
    this.$rpc.call('ui', 'get_lang').then(({ lang }) => {
      this.$store.commit('setLang', lang)
      if (lang === 'auto') lang = navigator.language.toLowerCase()

      if (lang === 'zh') lang = 'zh-cn'

      this.$rpc.call('ui', 'load_locales', { locale: lang }).then(locales => {
        /* Fix: empty Lua table to json */
        if (!Array.isArray(locales)) locales = []

        locales.forEach(locale => this.$i18n.mergeLocaleMessage(lang, locale))
        this.$i18n.locale = lang
        this.loaded = true
      })
    })
  }
}
</script>
