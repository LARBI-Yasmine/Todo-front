<template>
  <h1 class="text-4xl mt-5 font-extrabold mb-8 text-center text-gray-900">
    Détail de la tâche
  </h1>
  <div
    class="p-6 max-w-3xl mt-5 mx-auto bg-white rounded-3xl shadow-xl border border-gray-100"
  >
    <div v-if="tache" class="space-y-6">
      <div class="flex items-center justify-between border-b pb-4">
        <h2 class="text-3xl font-bold text-grey-400">{{ tache.title }}</h2>
        <span
          :class="[
            'px-4 py-1 rounded-full text-sm font-semibold',
            tache.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800',
          ]"
        >
          {{ tache.completed ? "Terminée" : "En cours" }}
        </span>
      </div>

      <p class="text-gray-700 text-lg leading-relaxed">
        {{ tache.description || "Pas de description fournie." }}
      </p>

      <div class="flex items-center space-x-6 text-gray-600">
        <div class="flex items-center space-x-2">
          <span>Date prévue :</span>
          <time :datetime="tache.date" class="ml-1 font-medium text-gray-900">
            {{ formatDate(tache.date) }}
          </time>
        </div>
      </div>

      <!-- Boutons Modifier / Supprimer -->
      <div class="flex gap-3 mt-10">
        <button
          @click="toggleCompletion"
          class="flex-1 bg-indigo-400 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          :disabled="loadingToggle"
        >
          {{
            tache.completed
              ? "Marquer comme non terminée"
              : "Marquer comme terminée"
          }}
        </button>

        <button
          @click="showDeleteModal = true"
          class="flex-1 bg-red-400 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          :disabled="loadingDelete"
        >
          Supprimer
        </button>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 text-xl mt-12">
      Chargement ou tâche non trouvée.
    </p>
  </div>

  <!-- Bouton Retour -->
  <div class="mt-12 text-center">
    <NuxtLink
      to="/"
      class="inline-block px-6 py-3 bg-orange-300 hover:bg-orange-400 text-gray-800 font-semibold rounded-lg transition duration-200"
    >
      Retour à la liste
    </NuxtLink>
  </div>

  <!-- Modal confirmation suppression (sans fond opaque) -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 pointer-events-auto"
    >
      <h3 class="text-2xl font-semibold text-gray-900">
        Confirmer la suppression
      </h3>
      <p class="text-gray-700">
        Es-tu sûr de vouloir supprimer cette tâche ? Cette action est
        irréversible.
      </p>

      <div class="flex justify-center gap-6">
        <button
          @click="confirmDelete"
          class="px-6 py-3 bg-red-400 hover:bg-red-700 text-white rounded-xl font-semibold transition duration-200 disabled:opacity-50"
          :disabled="loadingDelete"
        >
          Oui, supprimer
        </button>
        <button
          @click="cancelDelete"
          class="px-6 py-3 bg-orange-300 hover:bg-orange-400 rounded-xl font-semibold transition duration-200 disabled:opacity-50"
          :disabled="loadingDelete"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>

  <!-- Notification toast -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-[-10px]"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-[-10px]"
  >
    <div
      v-if="showToast"
      class="fixed top-18 right-6 bg-green-300 text-white px-6 py-3 rounded-xl shadow-lg z-50"
    >
      {{ toastMessage }}
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const tache = ref(null);
const loadingToggle = ref(false);
const loadingDelete = ref(false);
const showDeleteModal = ref(false);

const toastMessage = ref("");
const showToast = ref(false);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const showNotification = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const fetchTache = async () => {
  try {
    tache.value = await $fetch(
      `http://localhost:4000/api/taches/${route.params.id}`
    );
  } catch (error) {
    console.error("Erreur lors du chargement de la tâche :", error);
  }
};

onMounted(fetchTache);

const toggleCompletion = async () => {
  loadingToggle.value = true;
  try {
    const updated = await $fetch(
      `http://localhost:4000/api/taches/${route.params.id}`,
      {
        method: "PUT",
      }
    );
    tache.value = updated;
    showNotification(
      updated.completed
        ? "Tâche marquée comme terminée."
        : "Tâche marquée comme non terminée."
    );
  } catch (error) {
    showNotification("Erreur lors du changement de statut.");
    console.error(error);
  } finally {
    loadingToggle.value = false;
  }
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  try {
    await $fetch(`http://localhost:4000/api/taches/${route.params.id}`, {
      method: "DELETE",
    });
    showNotification("Tâche supprimée avec succès.");
    setTimeout(() => {
      router.push("/");
    }, 2500);
  } catch (error) {
    showNotification("Erreur lors de la suppression.");
    console.error(error);
  } finally {
    loadingDelete.value = false;
    showDeleteModal.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};
</script>
