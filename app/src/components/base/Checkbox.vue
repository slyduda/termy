<template>
  <div class="checkbox relative mb-2 last:mb-0" :class="[{ 'opacity-50': disabled }, { 'inline-flex mr-3': inline }]">
    <input 
        :id="cbId" 
        :checked="checked" 
        class="cursor-pointer" 
        type="checkbox" 
        :disabled="disabled" 
        @input="(event) => $emit('update:checked', event.target.checked)"
    />
    <label :for="cbId" class="cursor-pointer">
      <slot>
        <span v-if="inline">&nbsp;</span>
      </slot>
    </label>
    <div class="absolute left-1.5 top-1.5" v-if="checked">
        <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 8 8" >
            <path class="fill-gray-900 dark:fill-white" d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"></path>
        </svg>
    </div>
  </div>
</template>

<script>
function randomString(length = 7) {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let text = '';

  for (let i = 0; i < length; i++) text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

  return text;
}

export default {
  name: 'BaseCheckbox',
  model: {
    prop: 'checked'
  },
  props: {
    checked: {
      type: [Array, Boolean],
      default: false,
      description: 'Whether checkbox is checked'
    },
    disabled: {
      type: Boolean,
      description: 'Whether checkbox is disabled'
    },
    inline: {
      type: Boolean,
      description: 'Whether checkbox is inline'
    }
  },
  data() {
    return {
      cbId: '',
      touched: false
    };
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(check) {
        if (!this.touched) {
          this.touched = true;
        }
        this.$emit('input', check);
      }
    },
    inlineClass() {
      if (this.inline) {
        return `form-check-inline`;
      }
      return '';
    }
  },
  mounted() {
    this.cbId = randomString();
  }
};
</script>

<style>
input[type='checkbox'] {
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
.checkbox label:before {
  content: '';
  display: inline-block;
  width: 22px;
  height: 22px;
  vertical-align: -5px;
  @apply border-2;
  @apply border-gray-500;
  @apply box-border;
  @apply mr-2;
  @apply rounded-lg;
}
.checkbox input:hover:enabled + label:before {
  @apply border-blue-500;
}
/*
.checkbox input:focus + label:before {
  @apply ring-2;
}*/
.checkbox input:checked + label:before {
  @apply border-blue-500;
  @apply bg-blue-500;
}
.checkbox label:after {
  position: absolute;
  margin-left: 7px;
  margin-top: 7px;
  top: 0px;
  left: 0px;
  content: '';
  display: inline-block;
  vertical-align: -7px;
  width: 10px;
  height: 10px;
}
</style>