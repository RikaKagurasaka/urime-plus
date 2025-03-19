<template>
  <div class="modal-container" v-if="isOpen">
    <div class="modal-overlay" @click="close"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">出题</h2>
        <button class="close-button" @click="close">
          <div class="i-mdi-close w-5 h-5"></div>
        </button>
      </div>

      <div class="modal-body">
        <p class="">输入一个字，生成一个链接，分享给你的朋友</p>

        <input type="text" v-model="inputChar" class="char-input" />
        <div class="grid grid-cols-2 gap-2" v-if="isValid">
          <template v-for="(code, col) in answerRow" :key="col">
            <span>{{ colLabels[col] }}</span>
            <div class="font-mono">
              {{ code }}
            </div>
          </template>
        </div>

        <input type="text" :value="linkToCopy" readonly class="result-copy" />
        <div class="flex gap-2">
          <button
            class="copy-button"
            @click="copyLink"
            :disabled="!isValid"
            :class="{ 'opacity-50': copied }"
          >
            {{ copied ? "已复制" : "复制" }}
          </button>
          <button class="cancel-button" @click="close">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { encrypt } from "@/utils/crypto";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

const inputChar = ref("");
const encryptedResult = computed(() => {
  return encrypt(inputChar.value);
});
const linkToCopy = computed(() => {
  return isValid.value
    ? `${location.origin}${location.pathname}#${encryptedResult.value}`
    : "";
});
const { getDefaultRowByChar } = useGame();
const answerRow = computed(() => {
  return getDefaultRowByChar(inputChar.value);
});
const isValid = computed(() => {
  return Object.values(answerRow.value || {}).filter(Boolean).length > 1;
});

function close() {
  emit("update:isOpen", false);
  // Reset state when closing
  inputChar.value = "";
}
const copied = refAutoReset(false, 1000);
function copyLink() {
  navigator.clipboard.writeText(linkToCopy.value);
  copied.value = true;
}
</script>

<style scoped>
.modal-container {
  @apply fixed inset-0 flex items-center justify-center z-50;
}

.modal-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 z-10 overflow-hidden;
}

.modal-header {
  @apply flex justify-between items-center p-4;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.close-button {
  @apply text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent;
}

.modal-body {
  @apply p-6 space-y-4 pt-0;
}

.input-group {
  @apply space-y-2;
}

.input-group label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.char-input {
  @apply aspect-square w-16 h-16 mx-auto px-3 py-2 block;
  @apply border border-gray-300 dark:border-gray-600 rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white;
  @apply text-lg text-center;
}

.encrypt-button {
  @apply w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md
  disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.result-container {
  @apply mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2;
}

.result-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.result-copy {
  @apply font-mono text-base bg-white dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-600 break-all w-full;
}

.copy-button {
  @apply bg-blue-500 hover:bg-blue-600 rounded-md text-white block px-2 py-1 flex-1;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
.cancel-button {
  @apply bg-gray-500 hover:bg-gray-600 rounded-md text-white block px-2 py-1 flex-1;
}

.success-message {
  @apply text-center text-green-600 dark:text-green-400 text-sm mt-2;
}
</style>
