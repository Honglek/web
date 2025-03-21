<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div class="w-full h-48 relative">
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
      <p
        class="absolute top-2 right-2 fs-xs lg:text-base bg-red-500 text-white p-1 rounded-lg"
        v-if="product.discount > 0"
      >
        {{ product.discount }}% OFF
      </p>
    </div>
    <div class="p-4 relative h-36 sm:h-40 lg:h-44 2xl:h-48">
      <div class="flex justify-between items-start mb-2">
        <h3 class="fs-xs font-semibold truncate">
          {{ product.name_en }}
        </h3>
        <p class="fs-xs font-bold text-green-600">${{ product.price }}</p>
      </div>
      <p class="text-gray-600 truncate fs-xs">{{ product.name_kh }}</p>
      <p
        class="text-gray-500 mb-2 h-9 sm:h-10 lg:h-12 2xl:h-14 bg-red-6001 overflow-hidden line-clamp-3 break-all fs-xs"
      >
        {{ product.description }}
      </p>
      <div class="flex justify-between items-center absolute bottom-3">
        <button
          @click="$emit('view-details', product)"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition fs-xs"
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
