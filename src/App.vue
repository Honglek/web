<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md fixed w-full top-0 z-40">
      <div
        ref="headerRef"
        class="container mx-auto px-2 py-2 md:px-4 md:py-4 flex flex-col items-center"
      >
        <img
          src="../src/assets/logo.png"
          alt="Logo"
          class="h-16 w-16 md:w-20 md:h-20 mb-0"
        />
        <h1 class="fs-sm font-bold text-gray-800 text-center">
          The River Coffee
        </h1>
      </div>

      <!-- Categories Scroll -->
      <div class="border-t">
        <div class="container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide">
          <div
            v-if="!categories || categories.length === 0"
            class="overflow-x-auto w-full"
          >
            <div class="flex space-x-2 md:space-x-4 flex-nowrap w-max">
              <div
                v-for="n in 4"
                :key="n"
                class="animate-pulse h-10 w-24 bg-gray-300 rounded-full"
              ></div>
            </div>
          </div>
          <div v-else class="flex space-x-2 md:space-x-4">
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
              v-for="category in validCategories"
              :key="category.id"
              @click="selectCategory(category.name)"
              :class="[
                'px-4 py-2 rounded-full whitespace-nowrap transition fs-xs',
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
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6"
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
const {
  documents: products,
  error,
  isLoading,
} = useFirebase("products", [
  { field: "online", value: "true", operator: "==" },
]);

const selectedCategory = ref(null);
const selectedProduct = ref(null);
const showModal = ref(false);
const headerRef = ref(null);
const headerHeight = ref(0);
const windowWidth = ref(window.innerWidth);

// Computed property to group products by category
const groupedProducts = computed(() => {
  const productsList = products.value; // Access the array properly here

  // Scroll to the top of the page smoothly
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // Ensures smooth scrolling
  });
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
  const selectedProductName = selectedProduct.value.name_en
    .trim()
    .toLowerCase();
  if (!selectedProduct.value) return [];
  // const filteredProducts = products.value.filter(
  //   (p) => p.category_name === selectedProduct.value.category_name
  // );
  const filteredProducts = products.value.filter((p) => {
    const productName = p.name_en.trim().toLowerCase();
    return productName != selectedProductName;
  });

  // Shuffle function to randomize the array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  };

  // Shuffle filtered products
  shuffleArray(filteredProducts);

  if (windowWidth.value < 640) {
    return filteredProducts.slice(0, 3);
  } else if (windowWidth.value < 768) {
    return filteredProducts.slice(0, 4);
  } else {
    return filteredProducts.slice(0, 6);
  }
  // return products.value.filter(
  //   // Use .value to access the array
  //   (p) => p.category_name === selectedProduct.value.category_name
  // );
});

const validCategories = computed(() => {
  if (!categories.value || categories.value.length === 0) return [];

  const productCategories = new Set(products.value.map((p) => p.category_name)); // Get unique category names from products
  return categories.value.filter((category) =>
    productCategories.has(category.name)
  ); // Only include categories that have products
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

const updateHeight = () => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.clientHeight;
  }
};
const lockScroll = () => {
  document.body.style.overflow = "hidden";
};

const unlockScroll = () => {
  document.body.style.overflow = "auto";
};

onMounted(() => {
  updateHeight(); // Get initial height
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });

  // Create a ResizeObserver to watch for height changes
  const resizeObserver = new ResizeObserver(() => {
    updateHeight();
  });

  if (headerRef.value) {
    resizeObserver.observe(headerRef.value);
  }
  // Lock scroll when modal is open
  watch(showModal, (newVal) => {
    if (newVal) {
      lockScroll();
    } else {
      unlockScroll();
    }
  });

  // Cleanup observer when component unmounts
  onUnmounted(() => {
    resizeObserver.disconnect();
    unlockScroll();
  });
});

// Watch for changes in headerHeight and log it
// watch(headerHeight, (newHeight) => {
//   console.log("Header height changed:", newHeight);
// });
</script>
