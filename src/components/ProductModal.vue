<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <div
      ref="modalContainer"
      class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="relative">
        <button
          @click="close"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/2">
              <div v-if="product.image">
                <img
                  :src="product.image"
                  :alt="product.name_en"
                  @contextmenu.prevent
                  class="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div
                v-else
                class="w-full h-64 bg-slate-100 flex items-center justify-center rounded-lg"
              >
                <img
                  :src="coffeeCupImage"
                  class="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover"
                />
              </div>
            </div>
            <div class="md:w-1/2">
              <h2 class="font-bold mb-2 fs-md break-words w-full">
                {{ product.name_en }}
              </h2>
              <p class="text-gray-600 mb-4 fs-md break-words w-full">
                {{ product.name_kh }}
              </p>
              <div class="flex items-center gap-4 mb-4">
                <span class="fs-md font-bold text-green-600"
                  >${{ product.price }}</span
                >
                <span
                  v-if="product.discount > 0"
                  class="bg-red-500 text-white px-2 py-1 rounded fs-sm"
                >
                  {{ product.discount }}% OFF
                </span>
              </div>
              <p
                class="text-gray-600 mb-4 fs-sm break-words w-full"
                v-html="product.description"
              ></p>
            </div>
          </div>

          <!-- Related Products -->
          <div v-if="relatedProducts.length > 0" class="mt-8">
            <h3 class="font-semibold mb-4 fs-sm">Related Products</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="related in relatedProducts"
                class="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                @click="$emit('select-product', related)"
              >
                <div class="w-full h-32 relative">
                  <div v-if="related.image">
                    <img
                      :src="related.image"
                      :alt="related.name_en"
                      @contextmenu.prevent
                      class="w-full h-32 object-cover rounded mb-2"
                    />
                  </div>
                  <div
                    v-else
                    class="w-full h-32 bg-slate-100 flex items-center justify-center"
                  >
                    <img
                      :src="coffeeCupImage"
                      class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover"
                    />
                  </div>
                  <p
                    class="absolute top-2 right-2 fs-xs lg:text-base bg-red-500 text-white p-1 rounded-lg"
                    v-if="related.discount > 0"
                  >
                    {{ related.discount }}% OFF
                  </p>
                </div>

                <h4 class="font-semibold fs-sm truncate">
                  {{ related.name_en }}
                </h4>
                <p class="text-green-600 fs-sm">${{ related.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import coffeeCupImage from "../assets/coffee.svg";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  relatedProducts: {
    type: Array,
    default: () => [],
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const modalContainer = ref(null);
// Watch the product prop and scroll to the top when it changes
watch(
  () => props.product,
  (newProduct, oldProduct) => {
    if (newProduct !== oldProduct) {
      // // Scroll to top whenever the product changes
      // window.scrollTo({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth", // Ensures smooth scrolling
      // });
      if (modalContainer.value) {
        modalContainer.value.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth", // Smooth scroll
        });
      }
    }
  }
);

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

// Add event listener for "Escape" key when modal is open
onMounted(() => {
  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };

  window.addEventListener("keyup", handleEscKey);

  // Cleanup when component is unmounted
  onUnmounted(() => {
    window.removeEventListener("keyup", handleEscKey);
  });
});
</script>
