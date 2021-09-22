<template>
<div>
<div :class="{overlay:showStatsBox}"></div>
  <button class="stats-trigger" @click="call"> &lt; </button>
    <div class="stats-box" v-if="showStatsBox">
        <div class="stats-box-item">
          <div class="item-header">
            <h1>SYSTEM STATUS</h1>
            <a target="_blank">OPTIONS</a>
          </div>
          <div class="item-body">
            <div class="inline-items">
              <span>CPU</span>
              <progress :value="cpu" max="100"></progress>
              <span>{{cpu}}%</span>
            </div>
            <div class="inline-items">
              <span>FLASH</span>
              <span class="tooltip-text">
                  Used {{this.flash.used}} / {{this.flash.total}}
                </span>
              <progress :value="flashPercentage" max="100">
              </progress>
              <span>{{flashPercentage}}%</span>
            </div>
            <div class="inline-items">
              <span>RAM</span>
              <span class="tooltip-text">
                  Used {{this.ram.used}} / {{this.ram.total}}
                </span>
              <progress :value="ramPercentage" max="100"></progress>
              <span>{{ramPercentage}}%</span>
            </div>
          </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      showStatsBox: false,
      ram: {
        total: '0',
        used: '0'
      },
      cpu: '',
      flash: {
        total: '0',
        used: '0'
      }
    }
  },
  methods: {
    call () {
      this.showStatsBox = !this.showStatsBox
    }
  },
  created () {
    setInterval(() => {
      if (this.showStatsBox) {
        this.$system.getSystemInfo().then(response => {
          this.ram.total = '%mB'.format(response.memory.total)
          this.cpu = (response.load.reduce((sum, curr) => sum + curr) / 3 / 65536.0 / 4 * 100).toPrecision(2)
          this.ram.used = '%mB'.format(response.memory.total - response.memory.available)
        })
        this.$system.getDiskInfo().then(response => {
          this.flash.total = '%mB'.format(response.root.total)
          this.flash.used = '%mB'.format(response.root.used)
        })
      }
    }, 2000)
  },
  computed: {
    ramPercentage () {
      return (parseFloat(this.ram.used) / parseFloat(this.ram.total) * 100).toPrecision(2)
    },
    flashPercentage () {
      return (parseFloat(this.flash.used) / parseFloat(this.flash.total) * 100).toPrecision(2)
    }
  }
}
</script>

<style scoped>
.tooltip-text{
  opacity: 0;
  background-color: white;
  border: 1px solid rgba(128, 128, 128, 0.555);
  width: max-content;
  text-align: center;
  left: 30%;
  font-size: x-small;
  padding: 0.3rem 0.2rem;
  border-radius: 0.3rem;
  position:absolute;
  z-index: 7;
  transition: all 300ms ease-in;
}
.inline-items:hover > .tooltip-text {
  opacity: 1;
}
.overlay {
    background: rgba(255, 255, 255, 0.4);
    position: absolute;
    z-index: 5;
    width: 75vw;
    height: 75vh;
    margin: 0;
    padding: 0;
}
.stats-box{
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    max-height: 350px;
    overflow: hidden;
    overflow-y: scroll;
    z-index: 6;
    width: 400px;
    background-color: white;
    border: 1px solid rgba(65, 105, 225, 0.9);
    top: 50%;
    right: 5%;
    padding: 1rem;
    border-radius: 1rem 1rem;
    box-shadow: 0px 5px 25px 5px rgba(0,0,0,0.2);
}
.stats-box > * {
  opacity: 0.7;
  margin-bottom: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(110, 110, 110, 0.658);
  border-radius: 1rem;
  transition: all 100ms ease-in-out;
}
.stats-box > *:hover {
  opacity: 1;
  border: 1px solid royalblue;
  transform: scale(1.02);
}
.item-header {
  display: flex;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid gray;
  justify-content: space-between;
  align-items: center;
}
.item-body {
  display: flex;
  flex-flow: column nowrap;
}
.inline-items {
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.inline-items > * {
  min-width: 50px;
}
progress[value] {
  appearance:none;
  border-radius: 999px;
  border: none;
  background-color: whitesmoke;
  width: 200px;
  height: 12px;
  box-shadow:0px 1px 10px 2px rgba(0,0,0,0.2);
}
progress[value]::-moz-progress-bar{
  background-color: royalblue;
  border-radius: 1rem;
}
.stats-trigger{
  color: white;
  background-color: royalblue;
  padding: 1rem 0.8rem;
  border:none;
  position:absolute;
  z-index: 6;
  top: 50%;
  right:1%;
  border-radius: 1rem 2px 2px 1rem;
  font-size: x-large;
  transition: all 100ms ease;
}
.stats-trigger:hover{
  transform: scale(1.03);
  background-color: rgb(43, 87, 219);
}
</style>
