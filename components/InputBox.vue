<template>
  <div class="input-box">
    <button @click="submit" :disabled="!valid">提交</button>
    <input type="text" v-model="inputValue" @keypress.enter="submit" />
    <button @click="submit" :disabled="!valid">提交</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();
const inputValue = useVModel(props, "modelValue");
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "submit"): void;
}>();
const { solved } = useGame();
const submit = () => {
  if (!valid.value) return;
  emit("submit");
};

const { getDefaultRowByChar } = useGame();

const guessRow = computed(() => {
  return getDefaultRowByChar(inputValue.value);
});

const valid = computed(() => {
  return (
    [...inputValue.value].length === 1 &&
    Object.values(guessRow.value || {}).filter(Boolean).length > 1 &&
    !solved.value
  );
});
</script>

<style scoped>
.input-box {
  @apply flex items-stretch justify-center relative gap-2;
  & > input {
    @apply w-16 h-16 border border-gray-300 dark:border-gray-700 text-center text-2xl;
    @apply bg-gray-100 dark:bg-gray-800;
  }

  & > button {
    @apply w-8 bg-blue-500 text-white block px-2;
    @apply disabled:bg-gray-300 disabled:text-gray-500 disabled:dark:bg-gray-700;
  }
}
</style>
