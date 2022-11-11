<template>
  <div>
    <p v-if="title">
        {{ title }}
    </p>
    <a-progress
      :stroke-color="{
        '0%': '#87B5D5',
        '100%': '#108ee9'
      }"
      :percent="currVal"
      :format="currFormat"
      :stroke-width="barWeight"
      :style="`width: ${barWidth}%`"
      status="active"
      :show-info="showInfo"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    value: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      default: 100
    },
    unit: {
      type: String,
      default: '%'
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    barWeight: {
      type: Number,
      default: 10
    },
    barWidth: {
      type: Number,
      default: 50
    }
  },
  computed: {
    // computed value responsible for calculation of current value in percents
    // needed for other than % values
    currVal () {
      return Number(((this.value / this.maxValue) * 100).toFixed(0))
    },
    // format how value + unit will be displayed
    // default -> percentage
    currFormat () {
      return this.unit === '%'
        ? () => {
          return `${this.currVal} %`
        }
        : () => {
          return `${this.value} ${this.unit}`
        }
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
</style>
