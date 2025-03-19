<template>
  <CharSquare
    v-if="typeof guessColPadded === 'object'"
    v-for="(char, i) in guessColPadded?.guess"
    :key="`char-obj-${i}`"
    :char="char"
    :status="guessColPadded?.result[i]"
    :empty="!notEmpty"
    :active="active"
    :class="{
      'left-bordered': i === 0,
      'right-bordered': i === (guessColPadded?.guess?.length || 0) - 1,
    }"
    :is-odd="props.isOdd"
  />
  <CharSquare
    v-else
    v-for="(char, i) in [...guessColPadded]"
    :key="`char-str-${i}`"
    :char="char"
    :empty="!notEmpty"
    :active="active"
    @click="notEmpty && emit('click')"
    :class="{
      'cursor-pointer': notEmpty,
      'left-bordered': i === 0,
      'right-bordered': i === (guessColPadded?.length || 0) - 1,
    }"
    :is-odd="props.isOdd"
  />
</template>

<script setup lang="ts">
import { isVNode } from "vue";

const props = defineProps<{
  guessCol: GuessResult[Col] | string;
  maxLength?: number;
  empty?: boolean;
  active?: boolean;
  isOdd?: boolean;
}>();
const guessColPadded = computed(() => {
  if (typeof props.guessCol === "object") {
    return props.guessCol;
  }
  return (props.guessCol || "").padEnd(props.maxLength || 0, " ");
});
const notEmpty = computed(() => {
  if (props.empty) {
    return false;
  }
  if (typeof props.guessCol === "object") {
    return !!props.guessCol?.guess.length;
  }
  return !!props.guessCol;
});
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped></style>
