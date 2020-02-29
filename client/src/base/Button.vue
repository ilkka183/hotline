<template>
  <div class="button" :class="classObject"><slot></slot></div>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    small: { type: Boolean, default: false }
  },
  computed: {
    classObject() {
      return {
        blue: true,
        disabled: this.disabled,
        large: this.large,
        rounded: this.rounded,
        small: this.small
      }
    }
  }
}
</script>

<style scoped>
.button {
  border: none;
  cursor: pointer;
  display: inline-block;
  padding: 8px 16px;
  text-align: center;
  vertical-align: middle;
}

.small {
  padding: 4px 8px;
}

.large {
  padding: 12px 24px;
}

.rounded {
  border-radius: 8px;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.blue {
  background-color: #2196F3;
  color: #fff;
}
</style>
