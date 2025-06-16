<template>
  <div class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-900">
      Liste des Tâches
    </h1>

    <!-- Cartes -->
    <div
      v-if="paginatedTaches.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="tache in paginatedTaches"
        :key="tache._id"
        class="bg-white border border-gray-200 rounded-2xl shadow-md p-6 transition hover:shadow-lg hover:border-gray-300"
      >
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ tache.title }}
          </h2>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="
              tache.completed
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            "
          >
            {{ tache.completed ? "Terminée" : "En cours" }}
          </span>
        </div>

        <p class="text-sm text-gray-600">
          <span class="font-medium text-gray-500">Date prévue :</span>
          <time :datetime="tache.date" class="text-gray-700">
            {{ formatDate(tache.date) }}
          </time>
        </p>
        <!-- Bouton Détail -->
        <NuxtLink
          :to="`/taches/${tache._id}`"
          class="mt-4 inline-block px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700"
        >
          Détail
        </NuxtLink>
      </div>
    </div>

    <!-- Aucune tâche -->
    <p v-else class="text-center text-gray-600 mt-10 text-lg">
      Aucune tâche trouvée.
    </p>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex justify-center items-center gap-4 mt-10"
    >
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-orange-300 text-white-700 rounded-lg hover:bg-orange-500 disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="text-gray-700 font-medium">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-orange-300 text-white-700 rounded-lg hover:bg-orange-500 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const taches = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;

onMounted(async () => {
  try {
    taches.value = await $fetch("http://localhost:4000/api/taches");
  } catch (error) {
    console.error("Erreur lors du chargement des tâches :", error);
  }
});

const totalPages = computed(() =>
  Math.ceil(taches.value.length / itemsPerPage)
);

const paginatedTaches = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return taches.value.slice(start, end);
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
