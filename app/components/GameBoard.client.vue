<template>
  <div class="game-board" v-if="isReady">
    <div class="grid-container">
      <div
        v-for="col in mergedCols"
        :key="col"
        class="header-cell"
        :style="{
          gridColumn: `span ${maxCodeLength[col]} / span ${maxCodeLength[col]}`,
        }"
      >
        <button
          @click="
            showLetterStatusFor === col
              ? (showLetterStatusFor = null)
              : (showLetterStatusFor = col)
          "
          class="w-full bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-sm relative"
        >
          {{ colLabels[col] }}
          <HintView :type="(col as any)" v-show="showLetterStatusFor === col" />
        </button>
      </div>
      <template v-for="(row, rowIndex) in guessResults" :key="rowIndex">
        <CharSquare :char="row.char?.guess!" :status="row.char?.result![0]" />
        <template v-for="(col, i) in cols" :key="col">
          <CharGroup :guessCol="row[col]" :isOdd="i % 2 === 1" />
        </template>
      </template>
    </div>
    <InputBox v-model="inputValue" @submit="submit" />
    <div class="grid-container pb-4" v-if="currentGuessChoices">
      <template
        v-for="i in Math.max(
          ...Object.values(currentGuessChoices).map((col) => col?.length || 0)
        )"
        :key="i"
      >
        <CharGroup
          :guessCol="i == 1 ? currentGuessChoices.char : ' '"
          :empty="i > 1"
          :active="i == 1"
        />
        <template v-for="(col, j) in cols" :key="col">
          <CharGroup
            :guessCol="currentGuessChoices[col]?.[i - 1] || ''"
            :maxLength="maxCodeLength[col]"
            :active="currentGuess[col] === currentGuessChoices[col]?.[i - 1]"
            @click="
              currentGuessChoices[col] &&
                (currentGuess[col] = currentGuessChoices[col]?.[i - 1])
            "
            :isOdd="j % 2 === 1"
          />
        </template>
      </template>
    </div>
  </div>
  <div v-else class="w-full h-full flex items-center justify-center mt-8">
    <div class="text-2xl flex items-center gap-2">
      <div
        class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"
      ></div>
      正在加载
    </div>
  </div>
</template>

<script setup lang="ts">
const { cols, maxCodeLength, isReady, guessResults } = useGame();
const {
  mergedCols,
  currentGuessChoices,
  gridColCellCount,
  guess,
  inputValue,
  currentGuess,
  submit,
} = useBoard();
const { letterStatus } = useSolver();
const showLetterStatusFor = ref<keyof typeof letterStatus.value | null>(null);
const { autoScroll } = useConfig();
watch(currentGuessChoices, async (newVal) => {
  await nextTick();
  if (autoScroll.value) {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
});
</script>

<style scoped>
.grid-container {
  --grid-col-cell-count: v-bind(gridColCellCount);
  @apply grid grid-cols-[repeat(var(--grid-col-cell-count),1fr)];
  @apply mx-auto my-4;
  @apply w-[calc(var(--grid-col-cell-count)*100vw/20)] gap-0;
  @apply md:w-[calc(var(--grid-col-cell-count)*100vw/30)] md:gap-0.5;
  @apply lg:w-[calc(var(--grid-col-cell-count)*100vw/40)] lg:gap-1;
}
.header-cell {
  @apply text-center border-blue-200 dark:border-violet-800 rounded-sm;
  @apply text-sm border-2;
  @apply md:text-base md:border-b-3;
  @apply lg:text-lg lg:border-b-4;
}
</style>
