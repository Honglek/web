<template>
  <transition name="fade">
    <div v-if="loading" class="container mx-auto p-4">
      <div v-for="group in numGroups" :key="group" class="space-y-4 mb-4">
        <div class="animate-pulse h-10 w-32 bg-gray-300 rounded"></div>
        <div
          class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="n in numSkeletons"
            :key="`${group}-${n}`"
            class="animate-pulse space-y-4"
          >
            <div class="h-48 bg-gray-300 rounded"></div>
            <div class="h-6 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  loading: Boolean, // Prop to control visibility
});

const numSkeletons = 4;
const numGroups = 2;
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
