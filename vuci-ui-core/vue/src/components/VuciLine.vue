<template>
  <div :style="{backgroundColor: color, height: width + 'px', width: length}" class="vuci-line">
    <img v-if="disconnect" src="/icons/error.png" :style="{marginTop: (width / 2 - 20) + 'px'}" />
    <div v-else-if="active" class="vuci-line-active" :style="{height: width + 'px'}"/>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#56E67E'
    },
    width: {
      type: Number,
      default: 8
    },
    length: {
      type: String,
      default: '100%'
    },
    disconnect: Boolean,
    active: Boolean
  }
}
</script>

<style lang="stylus">
.vuci-line {
  text-align: center;
  margin: auto 10px auto;

  .vuci-line-active {
    position: relative;
    width: 10px;
    background: #09f;
    border-radius: 10px;
    animation: vuci-line-active 4s ease-in-out infinite;
  }
  @keyframes vuci-line-active {
    0% {
      left: 0;
    }
    50% {
      left: calc(100% - 10px);
    }
    100% {
      left: 0;
    }
  }
}
</style>
