<template>
  <button :class="buttonClass" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  emits: ['click'],
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'tertiary'].includes(value)
    },
    disabled: Boolean
  },
  computed: {
    buttonClass() {
      return [
        'btn',
        `btn-${this.variant}`,
        { 'btn-disabled': this.disabled }
      ]
    }
  },
  methods: {
    onClick(event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: 0.15s;
  border-radius: 0.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: hsla(0, 0%, 100%, 86%);
}

.btn-primary {
  background-color: hsla(142, 55%, 45%, 100%);
}

.btn-primary:hover {
  background-color: hsla(142, 55%, 55%, 100%);
}

.btn-primary:active {
  background-color: hsla(142, 55%, 30%, 100%);
}

.btn-secondary {
  background-color: hsla(4, 91%, 60%, 100%);
}

.btn-secondary:hover {
  background-color: hsla(4, 91%, 70%, 100%);
}

.btn-secondary:active {
  background-color: hsla(4, 91%, 45%, 100%);
}

.btn-tertiary {
  border: 2px solid #aaa;
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-tertiary:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.btn-tertiary:active {
  background-color: rgba(255, 255, 255, 0.1);
}


.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disabled:hover,
.btn-disabled:active {
  opacity: 0.6;
}
</style>
