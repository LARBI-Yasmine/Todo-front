<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-4xl font-extrabold text-center mb-10">Tableau de Tâches</h1>

    <!-- Filtres -->
    <div
      class="flex flex-col sm:flex-row sm:justify-start items-center gap-4 mb-8"
    >
      <select v-model="sortType" class="px-4 py-2 border rounded-lg">
        <option value="date">Trier par date</option>
        <option value="semaine">Trier par semaine</option>
        <option value="mois">Trier par mois</option>
      </select>

      <!-- Calendrier date visible uniquement si tri par date -->
      <input
        v-if="sortType === 'date'"
        type="date"
        v-model="dateFiltre"
        class="px-4 py-2 border rounded-lg"
      />

      <!-- Select mois visible uniquement si tri par mois -->
      <select
        v-if="sortType === 'mois'"
        v-model="moisFiltre"
        class="px-4 py-2 border rounded-lg"
      >
        <option value="">-- Choisir un mois --</option>
        <option v-for="(m, i) in moisOptions" :key="i" :value="i">
          {{ m }}
        </option>
      </select>

      <select v-model="filterDifficulte" class="px-4 py-2 border rounded-lg">
        <option value="">Toutes difficultés</option>
        <option value="faible">Faible</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>

      <button
        @click="resetFilters"
        class="bg-orange-300 hover:bg-orange-400 px-4 py-2 rounded-lg"
      >
        Réinitialiser
      </button>
    </div>

    <!-- Colonnes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(list, key) in filteredAndSortedLists"
        :key="key"
        class="bg-gray-100 p-4 rounded-xl"
      >
        <h2
          :class="titleClass(key)"
          class="text-xl font-semibold text-center mb-4"
        >
          {{ titles[key] }}
        </h2>

        <draggable
          :list="filteredAndSortedLists[key]"
          item-key="_id"
          group="taches"
          class="flex flex-col gap-4 min-h-[100px]"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <TacheCard :tache="element" />
          </template>
        </draggable>

        <p
          v-if="!filteredAndSortedLists[key].length"
          class="text-gray-500 italic text-center"
        >
          Aucune tâche.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import TacheCard from "@/components/TacheCard.vue";
import { api } from "../utils/axios";

// --- Références
const taches = ref([]);
const lists = ref({ aFaire: [], enCours: [], terminee: [] });
const sortType = ref("date");
const filterDifficulte = ref("");
const dateFiltre = ref(null); // Date choisie pour tri par date
const moisFiltre = ref(""); // Mois choisi pour tri par mois

// --- Options mois (index 0 = Janvier)
const moisOptions = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// --- Titres & styles
const titles = {
  aFaire: "À faire",
  enCours: "En cours",
  terminee: "Terminée",
};

const titleClass = (key) =>
  ({
    aFaire: "text-red-700",
    enCours: "text-yellow-700",
    terminee: "text-green-700",
  }[key] || "");

onMounted(async () => {
  try {
    const res = await api.get("/taches");

    const data = res.data;
    console.log("Tâches récupérées :", data);
    taches.value = data;

    lists.value.aFaire = data.filter((t) => t.type === "à faire");
    lists.value.enCours = data.filter((t) => t.type === "en cours");
    lists.value.terminee = data.filter((t) => t.type === "terminée");
  } catch (err) {
    console.error("Erreur chargement tâches", err);
  }
});

// --- Fonction pour récupérer le numéro de semaine
const getWeekNumber = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
};

// --- Tri & filtre combinés
const filteredAndSortedLists = computed(() => {
  return Object.fromEntries(
    Object.entries(lists.value).map(([key, items]) => {
      let result = [...items];

      // Filtrage par difficulté
      if (filterDifficulte.value) {
        result = result.filter((t) => t.difficulte === filterDifficulte.value);
      }

      // Filtrage par date sélectionnée si tri par date
      if (sortType.value === "date" && dateFiltre.value) {
        const selectedDate = new Date(dateFiltre.value);
        result = result.filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === selectedDate.getFullYear() &&
            tDate.getMonth() === selectedDate.getMonth() &&
            tDate.getDate() === selectedDate.getDate()
          );
        });
      }

      // Filtrage par mois sélectionné si tri par mois
      if (sortType.value === "mois" && moisFiltre.value !== "") {
        result = result.filter((t) => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === Number(moisFiltre.value);
        });
      }

      // Tri
      result.sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);

        if (sortType.value === "date") return da - db;
        if (sortType.value === "semaine")
          return getWeekNumber(da) - getWeekNumber(db);
        if (sortType.value === "mois") return da.getMonth() - db.getMonth();
        return 0;
      });

      return [key, result];
    })
  );
});

// --- Actions
function onDragEnd() {
  console.log("Tâche déplacée", lists.value);
}

function resetFilters() {
  sortType.value = "date";
  filterDifficulte.value = "";
  dateFiltre.value = null;
  moisFiltre.value = "";
}
</script>


