<template>
  <div class="show-letter-status">
    <div
      v-for="(row, index) in letterMaps.rows[props.type]"
      :key="index"
      :style="{
        marginLeft: `${index * 10}px`,
      }"
    >
      <div v-for="(letter, index) in row" :key="index">
        <CharSquare
          :char="letter"
          :status="getLetterStatus(letter)"
          sm
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: keyof typeof letterMaps.rows;
}>();
const { letterStatus } = useSolver();
function getLetterStatus(letter: string) {
  return letterStatus.value[props.type]![letter] as "o" | "?" | "x" | "-";
}
</script>

<style>
.show-letter-status {
  @apply absolute  bottom-8 left-0  h-fit  flex-col py-2  rounded-lg shadow-lg z-20 bg-gray-100 dark:bg-gray-800 w-fit;
  & > div {
    @apply flex;
  }
}
</style>
