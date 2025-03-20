<template>
  <div>
    <NuxtPwaAssets />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
<style>
:root {
  @apply bg-gray-50 text-gray-900;
  &.dark {
    @apply bg-gray-900 text-gray-50;
  }
}
</style>
<script setup>
if (import.meta.client) {
  if (localStorage.getItem("version") !== "1.0.0") {
    localStorage.clear();
    localStorage.setItem("version", "1.0.0");
    window.location.reload();
  }
}
</script>
