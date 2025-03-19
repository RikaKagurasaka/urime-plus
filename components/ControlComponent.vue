<template>
  <div class="control-component">
    <button @click="manualRefresh" class="btn text-blue-700 dark:text-blue-300">
      <div class="i-mdi-refresh w-5 h-5"></div>
      <span>刷新</span>
    </button>
    <button @click="reveal" class="btn text-red-700 dark:text-red-300">
      <div class="i-mdi-eye w-5 h-5"></div>
      <span>揭晓</span>
    </button>
    <button
      @click="showHelpModal = true"
      class="btn text-gray-700 dark:text-gray-300"
    >
      <div class="i-mdi-help-circle w-5 h-5"></div>
      <span>帮助</span>
    </button>
    <button @click="random" class="btn text-gray-700 dark:text-gray-300">
      <div class="i-mdi-dice-multiple w-5 h-5"></div>
      <span>随机</span>
    </button>
    <button
      @click="showSpecifyModal = true"
      class="btn text-gray-700 dark:text-gray-300"
    >
      <div class="i-mdi-key w-5 h-5"></div>
      <span>出题</span>
    </button>
    <button
      @click="showConfigModal = true"
      class="btn text-gray-700 dark:text-gray-300"
    >
      <div class="i-mdi-cog w-5 h-5"></div>
      <span>设置</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const {
  difficulty,
  cols,
  availableChars,
  ans,
  refresh,
  maxCodeLength,
  ansRow,
  getRowByChar,
  getDefaultRowByChar,
  guesses,
} = useGame();
const { currentGuess, currentGuessChoices, inputValue } = useBoard();

const props = defineProps<{
  showHelpModal: boolean;
  showSpecifyModal: boolean;
  showConfigModal: boolean;
}>();
const emit = defineEmits<{
  (e: "update:showHelpModal", value: boolean): void;
  (e: "update:showSpecifyModal", value: boolean): void;
  (e: "update:showConfigModal", value: boolean): void;
}>();
const showHelpModal = useVModel(props, "showHelpModal", emit);
const showSpecifyModal = useVModel(props, "showSpecifyModal", emit);
const showConfigModal = useVModel(props, "showConfigModal", emit);

function refreshAll() {
  ans.value = null;
  guesses.value = [];
  currentGuess.value = {} as Guess;
  inputValue.value = "";
  refresh();
}

function reveal() {
  inputValue.value = ans.value;
}
function random() {
  const randomIndex = Math.floor(Math.random() * availableChars.value.length);
  inputValue.value = availableChars.value[randomIndex];
}

const router = useRouter();
const hash = computed(() => router.currentRoute.value.hash);
const decryptedAnswer = computed(() => {
  const encryptedAnswer = hash.value.slice(1);
  return decrypt(encryptedAnswer);
});
onMounted(() => {
  if (decryptedAnswer.value) {
    refreshAll();
    ans.value = decryptedAnswer.value;
  }
});

function manualRefresh() {
  refreshAll();
  if (hash.value) {
    router.replace(router.currentRoute.value.path);
  }
}
</script>

<style scoped>
.control-component {
  @apply flex justify-center py-3;
}

.btn {
  @apply flex flex-col items-center gap-2 px-4 py-2 bg-transparent;
}
</style>
