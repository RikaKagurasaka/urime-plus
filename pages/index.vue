<template>
  <div>
    <NavBar />
    <div class="text-center text-gray-500 space-y-2 my-4">
      <p>一款类Wordle猜字游戏</p>
      <p>你被变成了输入法！根据提示猜测用户想要输入的汉字。</p>
      <p>↓第一次玩可以先看看帮助和设置↓</p>
    </div>
    <ControlComponent
      v-model:showHelpModal="showHelpModal"
      v-model:showSpecifyModal="showSpecifyModal"
      v-model:showConfigModal="showConfigModal"
    />
    <GameBoard />
    <HelpModal v-model:show-modal="showHelpModal" />
    <SpecifyAnswer
      :isOpen="showSpecifyModal"
      @update:isOpen="showSpecifyModal = $event"
    />
    <ConfigView :isOpen="showConfigModal" @close="showConfigModal = false" />
  </div>
</template>

<script setup lang="ts">
const {
  df,
  difficulty,
  cols,
  availableChars,
  ans,
  refresh,
  maxCodeLength,
  ansRow,
  getRowByChar,
  getDefaultRowByChar,
} = useGame();

const showHelpModal = ref(false);
const showSpecifyModal = ref(false);
const showConfigModal = ref(false);

useHead({
  title: "你才是输入法",
  meta: [
    {
      name: "description",
      content: "一款类Wordle猜字游戏，根据提示猜测用户想要输入的汉字。",
    },
  ],
});
</script>

<style scoped></style>
