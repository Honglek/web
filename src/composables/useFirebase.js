// composables/useFirebase.js
import { ref, onMounted, onUnmounted } from "vue";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export function useFirebase(collectionName) {
  const documents = ref([]);
  const error = ref(null);
  const isLoading = ref(true);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const q = query(collection(db, collectionName));
      const querySnapshot = await getDocs(q);
      documents.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      error.value = null; // Reset error on success
    } catch (err) {
      error.value = err.message; // Set error message
      console.error("Error fetching data:", err);
    } finally {
      isLoading.value = false; // Set loading to false after fetching
    }
  };
  // onMounted(fetchData);

  // Realtime listener for Firestore changes
  const setupRealtimeListener = () => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        documents.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        error.value = null; // Reset error on success
      },
      (err) => {
        error.value = err.message; // Set error message
        console.error("Error in realtime listener:", err);
      }
    );

    return unsubscribe; // Return the unsubscribe function
  };

  // Automatically fetch data when the component is mounted
  onMounted(() => {
    fetchData(); // Fetch data once
    const unsubscribe = setupRealtimeListener(); // Setup realtime listener

    // Cleanup the listener when the component is unmounted
    onUnmounted(() => {
      unsubscribe();
    });
  });

  return {
    documents,
    error,
    isLoading,
    fetchData,
  };
}
