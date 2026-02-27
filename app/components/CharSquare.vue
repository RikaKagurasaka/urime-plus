<template>
  <div
    :class="[
      classMap[status],
      { empty: empty },
      { active: active },
      { sm: sm },
      { 'is-odd': isOdd },
    ]"
    class="char-square font-plangothic"
  >
    <span>{{ char }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    char: string;
    status?: "o" | "?" | "x" | "-";
    empty?: boolean;
    active?: boolean;
    sm?: boolean;
    isOdd?: boolean;
  }>(),
  {
    status: "-",
    empty: false,
    active: false,
    sm: false,
    isOdd: false,
  }
);
const classMap = {
  o: "correct",
  "?": "present",
  x: "absent",
  "-": "unknown",
};
</script>

<style scoped>
.char-square {
  @apply aspect-ratio-square;
  @apply sm:rounded-none md:rounded-sm lg:rounded-md;
  @apply flex items-center justify-center relative;

  container-type: inline-size;
  & > span {
    @apply text-[60cqw] uppercase font-bold;
  }

  &:not(.empty) {
    @apply border border-gray-300 dark:border-gray-700;
  }
}
.sm {
  @apply text-sm w-6 h-6 border-none rounded-none;
  & > span {
    @apply font-normal;
  }
}
.unknown {
  @apply bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50;
}
.absent {
  @apply bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200;
}
.present {
  @apply bg-yellow-500 text-white;
}
.correct {
  @apply bg-green-500 text-white;
}
.active {
  @apply bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100;
  @apply shadow shadow-blue-100 dark:shadow-blue-700;
}
.xs {
  @apply text-xs w-4 h-4;
}
.sm {
  @apply text-sm w-6 h-6;
}
.md {
  @apply text-base w-8 h-8;
}
.lg {
  @apply text-lg w-12 h-12;
}
</style>
