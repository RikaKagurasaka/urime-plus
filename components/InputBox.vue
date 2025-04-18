<template>
  <div class="input-box">
    <button @click="submit" :disabled="!valid">提交</button>
    <input
      type="text"
      v-model="inputValue"
      @keypress.enter="submit"
      ref="inputRef"
      class="font-plangothic"
    />
    <button @click="submit" :disabled="!valid">提交</button>
  </div>
  <!-- <teleport to="body">
    <canvas
      ref="canvasRef"
      class="fixed left-0 top-0 w-screen h-screen z-100 pointer-events-none"
    />
  </teleport> -->
</template>

<script setup lang="ts">
import confetti from "canvas-confetti";
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
const inputRef = ref<HTMLInputElement>();
const {
  width: inputWidth,
  height: inputHeight,
  left: inputLeft,
  top: inputTop,
} = useElementBounding(inputRef);

watch(solved, () => {
  if (solved.value) {
    confetti({
      particleCount: 100,
      spread: 100,
      disableForReducedMotion: true,
      origin: {
        x: (inputLeft.value + inputWidth.value / 2) / window.innerWidth,
        y: (inputTop.value + inputHeight.value / 2) / window.innerHeight,
      },
    });
  }
});

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
