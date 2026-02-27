<template>
  <nav
    class="w-full bg-light dark:bg-dark border-b border-gray-200 dark:border-gray-700 z-50 px-4 py-3 flex justify-between items-center"
  >
    <NuxtImg src="/icon.svg" alt="logo" class="w-8 h-8" />
    <!-- Title on the left -->
    <div
      class="text-2xl font-bold text-gray-800 dark:text-gray-200 px-2 font-serif"
    >
      你才是输入法
    </div>
    <div class="flex-1" />

    <!-- Controls on the right -->
    <div class="flex items-center gap-3">
      <!-- Theme toggle button -->
      <button
        @click="toggleDark()"
        class="p-2 rounded-full dark:bg-gray-700 transition-colors"
      >
        <div
          class="i-carbon-sun dark:i-carbon-moon w-5 h-5 text-gray-700 dark:text-gray-300"
        ></div>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

// Use VueUse's useDark and useToggle composables
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>
