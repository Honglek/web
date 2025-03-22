// composables/useFirebase.js
import { ref, onMounted, onUnmounted } from "vue";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useFirebase(collectionName, conditions = [], order = null) {
  const documents = ref([]);
  const error = ref(null);
  const isLoading = ref(true);

  // Function to construct the Firestore query
  const constructQuery = () => {
    let q = collection(db, collectionName);

    // Apply conditions
    conditions.forEach((condition) => {
      if (condition && condition.field && condition.value !== undefined) {
        const operator = condition.operator || "==";
        q = query(q, where(condition.field, operator, condition.value));
      }
    });

    // Apply ordering if specified
    if (order) {
      const { field, direction = "asc" } = order; // Default direction is "asc"
      q = query(q, orderBy(field, direction));
    }

    return q;
  };

  // Function to fetch data from Firestore
  const fetchData = async () => {
    isLoading.value = true;
    try {
      const q = constructQuery(); // Construct the query
      const querySnapshot = await getDocs(q);
      documents.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      error.value = null;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Realtime listener for Firestore changes
  const setupRealtimeListener = () => {
    const q = constructQuery();

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        documents.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        error.value = null;
      },
      (err) => {
        error.value = err.message;
        console.error("Error in realtime listener:", err);
      }
    );

    return unsubscribe;
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
