<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div v-if="product.image">
      <img :src="product.image" class="w-full h-48 object-cover" />
    </div>
    <div
      v-else
      class="w-full h-48 bg-slate-100 flex items-center justify-center"
    >
      <img
        :src="coffeeCupImage"
        class="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover"
      />
    </div>
    <div class="p-4 relative h-44">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-semibold">{{ product.name_en }}</h3>
          <p class="text-gray-600">{{ product.name_kh }}</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold text-green-600">
            <!-- ${{ product.price.toFixed(2) }} -->
            ${{ product.price }}
          </p>
          <p v-if="product.discount > 0" class="text-sm text-red-500">
            -{{ product.discount }}%
          </p>
        </div>
      </div>
      <p
        class="text-sm text-gray-500 mb-2 h-10 bg-red-6001 overflow-hidden line-clamp-3 break-all"
      >
        {{ product.description }}
      </p>
      <div class="flex justify-between items-center absolute bottom-3">
        <!-- <span class="text-xs text-gray-400">{{ product.code }}</span> -->
        <button
          @click="$emit('view-details', product)"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import coffeeCupImage from "../assets/coffee.svg";
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(["view-details"]);
</script>
