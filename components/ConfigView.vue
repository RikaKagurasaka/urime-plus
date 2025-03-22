<template>
  <div>
    <Transition name="overlay">
      <div v-if="isOpen" class="overlay" @click="$emit('close')"></div>
    </Transition>

    <Transition name="slide">
      <div v-if="isOpen" class="config-panel">
        <div class="panel-header">
          <h2>游戏设置</h2>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <div class="panel-content">
          <!-- Available characters counter -->
          <div class="char-counter">
            <div class="char-counter-label">可用汉字数量:</div>
            <div class="char-counter-value">
              {{ Math.floor(animatedAvailableCharsLength) }}
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 my-1">
            可用汉字数量受到难度和所选输入方案的字库容量限制，你仍然可以尝试猜测任何字，但缺失的输入方案码不会被判定正确性。
          </p>

          <div class="setting-group">
            <h3>难度</h3>
            <div class="options-container">
              <button
                v-for="option in difficultyOptions"
                :key="option.value"
                :class="['option-btn', { active: difficulty === option.value }]"
                @click="difficulty = option.value"
              >
                {{ option.label }}
              </button>
            </div>
            <h3>简繁体</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              简繁体的判定可能存在错误，仅供参考
            </p>
            <div class="options-container">
              <button
                :class="['option-btn', { active: chtOrChs === 'chs' }]"
                @click="chtOrChs = 'chs'"
              >
                仅简体</button
              ><button
                :class="['option-btn', { active: chtOrChs === 'cht' }]"
                @click="chtOrChs = 'cht'"
              >
                仅繁体
              </button>
              <button
                :class="['option-btn', { active: chtOrChs === 'both' }]"
                @click="chtOrChs = 'both'"
              >
                两者
              </button>
            </div>
          </div>

          <div class="setting-group">
            <h3>简/全码</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              变更后需要刷新页面生效
            </p>
            <div class="options-container">
              <button
                :class="['option-btn', { active: !reverseWubi }]"
                @click="reverseWubi = false"
              >
                优先简码
              </button>
              <button
                :class="['option-btn', { active: reverseWubi }]"
                @click="reverseWubi = true"
              >
                优先全码
              </button>
            </div>
          </div>

          <div class="setting-group">
            <h3>选择输入方案</h3>

            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              变更后请重置新的题目！否则可能出现不可预料的问题
            </p>

            <!-- Shape methods -->
            <div class="col-category">
              <h4>形码</h4>
              <div class="options-container">
                <button
                  v-for="col in COLS_SHAPE"
                  :key="col"
                  :class="[
                    'option-btn option-btn-small',
                    { active: isSelected(col) },
                  ]"
                  @click="toggleCol(col, 'multiple')"
                  :disabled="isDisabled(col)"
                >
                  {{ colLabels[col] }}
                </button>
              </div>
            </div>

            <!-- Phonetic methods -->
            <div class="col-category">
              <h4>音码</h4>
              <div class="options-container">
                <button
                  v-for="col in COLS_PHONETIC"
                  :key="col"
                  :class="[
                    'option-btn option-btn-small',
                    { active: isSelected(col) },
                  ]"
                  @click="toggleCol(col, 'multiple')"
                  :disabled="isDisabled(col)"
                >
                  {{ colLabels[col] }}
                </button>
              </div>
            </div>

            <!-- Double methods -->
            <div class="col-category">
              <h4>双拼</h4>
              <div class="options-container">
                <button
                  v-for="col in COLS_DOUBLE"
                  :key="col"
                  :class="[
                    'option-btn option-btn-small',
                    { active: isSelected(col) },
                  ]"
                  @click="toggleCol(col, 'single', 'double')"
                  :disabled="isDisabled(col)"
                >
                  {{ colLabels[col] }}
                </button>
              </div>
            </div>

            <!-- Auxiliary methods -->
            <div class="col-category">
              <h4>辅助码</h4>
              <div class="options-container">
                <button
                  v-for="col in COLS_AUX"
                  :key="col"
                  :class="[
                    'option-btn option-btn-small',
                    { active: isSelected(col) },
                  ]"
                  @click="toggleCol(col, 'single', 'aux')"
                  :disabled="isDisabled(col)"
                >
                  {{ colLabels[col] }}
                </button>
              </div>
            </div>

            <!-- Other methods -->
            <div class="col-category">
              <h4>其他</h4>
              <div class="options-container">
                <button
                  v-for="col in COLS_OTHERS"
                  :key="col"
                  :class="[
                    'option-btn option-btn-small',
                    { active: isSelected(col) },
                  ]"
                  @click="toggleCol(col, 'multiple')"
                  :disabled="isDisabled(col)"
                >
                  {{ colLabels[col] }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { difficulty, cols, availableChars, chtOrChs } = useGame();
const { reverseWubi } = useConfig();
const props = defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const animatedAvailableCharsLength = useTransition(
  () => availableChars.value.length,
  {
    duration: 150,
  }
);

// Initialize with current values
onMounted(() => {
  initSelections();
});

// Watch for changes in props.isOpen to refresh selection state
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      initSelections();
    }
  }
);

function initSelections() {
  // Nothing special needed here as we're working directly with cols.value
}

function isSelected(col: Col): boolean {
  return cols.value.includes(col);
}

function toggleCol(
  col: Col,
  mode: "multiple" | "single",
  category?: "double" | "aux"
) {
  const newCols = [...cols.value];

  if (mode === "single" && category) {
    // For single selection categories
    const categoryItems = category === "double" ? COLS_DOUBLE : COLS_AUX;
    const otherCategoryItems = category === "double" ? COLS_AUX : COLS_DOUBLE;
    const isCurrentlySelected = isSelected(col);

    // Add the selected item only if it wasn't already selected
    if (!isCurrentlySelected) {
      // Remove all items from this category
      categoryItems.forEach((item) => {
        const index = newCols.indexOf(item);
        if (index !== -1) newCols.splice(index, 1);
      });
      newCols.push(col);

      if (otherCategoryItems.every((item) => !isSelected(item))) {
        newCols.push(otherCategoryItems[0]);
      }
    } else {
      // Remove all selected items in COLS_DOUBLE and COLS_AUX
      [...COLS_DOUBLE, ...COLS_AUX].forEach((item) => {
        const index = newCols.indexOf(item);
        if (index !== -1) newCols.splice(index, 1);
      });
    }
  } else {
    // For multiple selection categories
    const index = newCols.indexOf(col);

    if (index !== -1) {
      // Only remove if we still have at least one column selected after removal
      if (newCols.length > 1) {
        newCols.splice(index, 1);
      }
    } else {
      newCols.push(col);
      if (col === "wubi98" && newCols.includes("wubi86")) {
        newCols.splice(newCols.indexOf("wubi86"), 1);
      } else if (col === "wubi86" && newCols.includes("wubi98")) {
        newCols.splice(newCols.indexOf("wubi98"), 1);
      }
    }
  }

  cols.value = newCols;

  //   sort cols in the same order as COLS_ALL
  cols.value = cols.value.sort(
    (a, b) => COLS_ALL.indexOf(a) - COLS_ALL.indexOf(b)
  );
}

// Prevent removing when it would leave us with no selected columns
function isDisabled(col: Col): boolean {
  // If the column is not selected, it can always be selected
  if (!isSelected(col)) return false;

  // If this is the only column selected, we can't remove it
  if (cols.value.length <= 1 && isSelected(col)) return true;

  //   If all active columns are DOUBLE or AUX, we can't remove active columns
  if (
    cols.value.every((item: any) =>
      [...COLS_DOUBLE, ...COLS_AUX].includes(item)
    ) &&
    isSelected(col)
  )
    return true;
  return false;
}
</script>

<style scoped>
.overlay {
  @apply fixed inset-0 bg-black/50 z-10;
}

.config-panel {
  @apply fixed top-0 right-0 bottom-0 w-120 max-w-full bg-white dark:bg-gray-800 shadow-lg z-20 p-5 overflow-y-auto text-gray-900 dark:text-gray-100;
  & button:not(.active) {
    @apply dark:bg-gray-700 dark:text-gray-100;
    &:hover {
      @apply dark:bg-gray-600;
    }
  }
}

.panel-header {
  @apply flex justify-between items-center mb-5;
}

.panel-header h2 {
  @apply m-0;
}

.close-btn {
  @apply bg-transparent border-0 text-2xl cursor-pointer;
}

.panel-content {
  @apply pt-4;
}

.char-counter {
  @apply flex items-center justify-between p-3 mb-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600;
}

.char-counter-label {
  @apply font-medium;
}

.char-counter-value {
  @apply font-bold text-lg text-green-600 dark:text-green-400;
}

.setting-group {
  @apply mb-6;
}

.setting-group h3 {
  @apply my-3 text-lg font-medium;
  &:has(+ p) {
    @apply mb-1;
  }
}

/* Common option containers */
.options-container {
  @apply flex flex-wrap gap-2.5;
}

/* Common button styles */
.option-btn {
  @apply px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-gray-100 
  cursor-pointer transition-all duration-200;
}

.option-btn:hover:not(:disabled) {
  @apply bg-gray-200 dark:bg-gray-600;
}

.option-btn.active {
  @apply bg-green-500 text-white border-green-500 dark:bg-green-600 dark:border-green-600;
}

/* Small variant for input method buttons */
.option-btn-small {
  @apply px-1.5 py-1;
}

.option-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.col-category {
  @apply mb-4;
}

.col-category h4 {
  @apply mb-2 text-base font-medium;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  @apply transition-opacity duration-300 ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  @apply opacity-0;
}

.slide-enter-active,
.slide-leave-active {
  @apply transition-transform duration-300 ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  @apply translate-x-full;
}
</style>
