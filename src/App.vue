<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md fixed w-full top-0 z-40">
      <div
        ref="headerRef"
        class="container mx-auto px-4 py-4 flex flex-col items-center"
      >
        <img src="../src/assets/logo.png" alt="Logo" class="h-20 w-20 mb-0" />
        <h1 class="text-xl font-bold text-gray-800 text-center">
          The River Coffee
        </h1>
      </div>

      <!-- Categories Scroll -->
      <div class="border-t">
        <div class="container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide">
          <div
            v-if="!categories || categories.length === 0"
            class="flex space-x-4"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="animate-pulse h-10 w-16 bg-gray-300 rounded-full"
            ></div>
          </div>
          <div v-else class="flex space-x-4">
            <!-- All Categories Button -->
            <button
              @click="selectedCategory = null"
              :class="[
                'px-4 py-2 rounded-full whitespace-nowrap transition',
                !selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              All Categories
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.name)"
              :class="[
                'px-4 py-2 rounded-full whitespace-nowrap transition',
                selectedCategory === category.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <Skeleton
      v-if="isLoading"
      :loading="isLoading"
      :style="{ paddingTop: headerHeight + 70 + 'px' }"
    />

    <!-- Main Content -->
    <main
      v-else
      class="container mx-auto px-4 pb-8"
      :style="{ paddingTop: headerHeight + 70 + 'px' }"
    >
      <div class="space-y-8">
        <div
          v-for="(categoryProducts, categoryName) in groupedProducts"
          :key="categoryName"
        >
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ categoryName }}
          </h2>
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
          >
            <ProductCard
              v-for="product in categoryProducts"
              :key="product.code"
              :product="product"
              @view-details="viewProductDetails"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Product Detail Modal -->
    <ProductModal
      v-if="selectedProduct"
      :product="selectedProduct"
      :related-products="relatedProducts"
      :is-open="showModal"
      @close="closeModal"
      @select-product="viewProductDetails"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import ProductCard from "./components/ProductCard.vue";
import ProductModal from "./components/ProductModal.vue";
import Skeleton from "./components/skeleton.vue";

import { useFirebase } from "./composables/useFirebase";
const { documents: categories } = useFirebase("product_category");
const { documents: products, error, isLoading } = useFirebase("products");

const selectedCategory = ref(null);
const selectedProduct = ref(null);
const showModal = ref(false);

// Computed property to group products by category
const groupedProducts = computed(() => {
  const productsList = products.value; // Access the array properly here
  if (selectedCategory.value) {
    // If category is selected, only show products from that category
    return {
      [selectedCategory.value]: productsList.filter(
        (p) => p.category_name === selectedCategory.value
      ),
    };
  }
  // Group all products by category
  return productsList.reduce((acc, product) => {
    if (!acc[product.category_name]) {
      acc[product.category_name] = [];
    }
    acc[product.category_name].push(product);
    return acc;
  }, {});
});

// Computed property to show related products (same category, but different product)
const relatedProducts = computed(() => {
  if (!selectedProduct.value) return [];
  return products.value.filter(
    // Use .value to access the array
    (p) =>
      p.category_name === selectedProduct.value.category_name &&
      p.code !== selectedProduct.value.code
  );
});

const selectCategory = (category) => {
  selectedCategory.value =
    selectedCategory.value === category ? null : category;
};

const viewProductDetails = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
const headerRef = ref(null);
const headerHeight = ref(0);

const updateHeight = () => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.clientHeight;
  }
};

onMounted(() => {
  updateHeight(); // Get initial height

  // Create a ResizeObserver to watch for height changes
  const resizeObserver = new ResizeObserver(() => {
    updateHeight();
  });

  if (headerRef.value) {
    resizeObserver.observe(headerRef.value);
  }

  // Cleanup observer when component unmounts
  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});

// Watch for changes in headerHeight and log it
// watch(headerHeight, (newHeight) => {
//   console.log("Header height changed:", newHeight);
// });
</script>
