<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-4xl font-bold text-center mb-10 text-gray-900">
      Détail de la tâche
    </h1>

    <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <!-- Affichage détail -->
      <div v-if="tache && !enEdition" class="space-y-6">
        <div class="flex items-center justify-between border-b pb-4">
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ tache.title }}
          </h2>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="badgeClass(tache.type)"
          >
            {{ tache.type }}
          </span>
        </div>

        <p class="text-gray-700 text-lg leading-relaxed">
          {{ tache.description || "Pas de description fournie." }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600 mt-4">
          <div>
            <span class="font-medium text-gray-800">Date prévue :</span>
            <br />
            {{ formatDate(tache.date) }}
          </div>
          <div>
            <span class="font-medium text-gray-800">Difficulté :</span>
            <br />
            {{ tache.difficulte }}
          </div>
          <div>
            <span class="font-medium text-gray-800">Estimation :</span>
            <br />
            {{ tache.estimation }} jour(s)
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            @click="showDeleteModal = true"
            class="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            :disabled="loadingDelete"
          >
            Supprimer
          </button>
          <button
            @click="enEdition = true"
            class="w-full sm:w-auto bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Modifier
          </button>
        </div>
      </div>
      <!-- Formulaire modification -->
      <div v-else-if="enEdition" class="mt-10">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
          Modifier la tâche
        </h2>

        <form
          @submit.prevent="submitUpdate"
          class="bg-white p-6 rounded-2xl min-h-[50vh] shadow-md w-full max-w-2xl mx-auto space-y-4"
        >
          <div>
            <label
              for="edit-title"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Titre
            </label>
            <input
              id="edit-title"
              v-model="editForm.title"
              placeholder="Titre de la tâche"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label
              for="edit-type"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="edit-type"
              v-model="editForm.type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option disabled value="">-- Choisir un type --</option>
              <option value="à faire">à faire</option>
              <option value="en cours">en cours</option>
              <option value="terminée">terminée</option>
            </select>
          </div>

          <div>
            <label
              for="edit-description"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              v-model="editForm.description"
              placeholder="Description de la tâche"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>

          <div>
            <label
              for="edit-difficulte"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Difficulté
            </label>
            <select
              id="edit-difficulte"
              v-model="editForm.difficulte"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option disabled value="">-- Choisir une difficulté --</option>
              <option value="faible">faible</option>
              <option value="moyen">moyen</option>
              <option value="difficile">difficile</option>
            </select>
          </div>

          <div>
            <label
              for="edit-estimation"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Estimation (en jours)
            </label>
            <input
              id="edit-estimation"
              v-model.number="editForm.estimation"
              type="number"
              min="1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label
              for="edit-date"
              class="block text-sm mb-1 font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="edit-date"
              v-model="editForm.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              class="w-full sm:w-auto bg-blue-400 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Enregistrer
            </button>
            <button
              type="button"
              @click="enEdition = false"
              class="w-full sm:w-auto bg-red-400 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <p v-else class="text-gray-500 text-center text-xl mt-8">
        Chargement en cours...
      </p>
    </div>

    <!-- Bouton retour -->
    <div class="text-center mt-10">
      <NuxtLink
        to="/ListTache"
        class="inline-block bg-orange-300 hover:bg-orange-400 text-gray-900 font-semibold px-6 py-3 rounded-lg"
      >
        Retour à la liste
      </NuxtLink>
    </div>

    <!-- Modal suppression -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Confirmer la suppression
        </h3>
        <p class="text-gray-600">
          Es-tu sûr de vouloir supprimer cette tâche ? Cette action est
          irréversible.
        </p>
        <div class="flex justify-end gap-4 mt-6">
          <button
            @click="confirmDelete"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            :disabled="loadingDelete"
          >
            Supprimer
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showToast"
        class="fixed top-6 right-6 bg-orange-300 text-white px-6 py-3 rounded-xl shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../utils/axios";

const route = useRoute();
const router = useRouter();

const tache = ref(null);
const loadingDelete = ref(false);
const showDeleteModal = ref(false);
const enEdition = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

const editForm = reactive({
  title: "",
  description: "",
  type: "à faire",
  difficulte: "faible",
  estimation: 1,
  date: "",
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function badgeClass(type) {
  switch (type) {
    case "à faire":
      return "bg-red-100 text-red-600";
    case "en cours":
      return "bg-yellow-100 text-yellow-700";
    case "terminée":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function showToastMessage(msg) {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

async function fetchTache() {
  try {
    const res = await api.get(`/taches/${route.params.id}`);
    if (res.status !== 200) throw new Error("Erreur lors du chargement");
    const data = res.data;
    tache.value = data;

    Object.assign(editForm, {
      title: data.title,
      description: data.description || "",
      type: data.type,
      difficulte: data.difficulte,
      estimation: data.estimation,
      date: data.date.split("T")[0],
    });
  } catch (error) {
    console.error(error);
  }
}

async function submitUpdate() {
  try {
    const res = await api.put(`/taches/${route.params.id}`, {
      headers: { "Content-Type": "application/json" },
      editForm,
    });
    if (res.status !== 200) throw new Error("Erreur lors du chargement");
    showToastMessage("Tâche mise à jour");
    enEdition.value = false;
    await fetchTache();
  } catch (err) {
    console.error(err);
    showToastMessage("Échec de la mise à jour");
  }
}

async function confirmDelete() {
  loadingDelete.value = true;
  try {
    const res = await api.delete(`/taches/${route.params.id}`);
    console.log(res.status);
    if (res.status === 204) {
      showToastMessage("Tâche supprimée");
      // Attendre 2 secondes avant de rediriger
      setTimeout(() => {
        router.push("/ListTache");
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    showToastMessage("Erreur suppression");
  } finally {
    loadingDelete.value = false;
    showDeleteModal.value = false;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
}

onMounted(fetchTache);
</script>
