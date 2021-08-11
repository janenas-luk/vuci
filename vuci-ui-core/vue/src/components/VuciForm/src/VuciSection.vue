<script>
export default {
  inject: ['vuciForm'],
  provide () {
    return {
      vuciSection: this
    }
  },
  props: {
    title: String,
    uciConfig: String,
    card: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loaded: false
    }
  },
  components: {
    VuciSectionContainerDiv: {
      render (h) {
        return h('div', this.$slots.default)
      }
    }
  },
  computed: {
    container () {
      if (this.card && !this.columns) return 'a-card'
      return 'vuci-section-container-div'
    },
    config () {
      return this.uciConfig || this.vuciForm.uciConfig
    },
    form () {
      return this.vuciForm.form
    }
  },
  methods: {
    get (sid, name) {
      return this.form[`${sid}_${name}`]
    },
    set (sid, name, value) {
      this.form[`${sid}_${name}`] = value
    }
  },
  created () {
    if (this.uciConfig) {
      this.$uci.load(this.uciConfig).then(() => {
        this.loaded = true
      })
    } else {
      this.loaded = true
    }
  }
}
</script>
