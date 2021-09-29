<template>
  <div class="overlay">
    <div class="box">
      <div class="header">
        <slot name="header">Header</slot>
      </div>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position:absolute;
  z-index: 9999;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  bottom: 0;
}
.box {
  padding: 1.5rem 1.5rem;
  width: 80%;
  background: white;
  border-radius: 1rem 1rem;
}
.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  font-size: 24px;
  text-align: center;
}
</style>
