<template>
  <h2 class="text-2xl mt-4 font-bold text-center text-gray-800">
    Ajouter une tâche
  </h2>
  <form
    @submit.prevent="ajouterTache"
    class="bg-white p-6 rounded-2xl min-h-[50vh] shadow-md w-full max-w-2xl mx-auto space-y-4"
  >
    <div>
      <label for="title" class="block text-sm mb-1 font-medium text-gray-700">
        Titre
      </label>
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Titre de la tâche"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>

    <div>
      <label for="type" class="block text-sm mb-1 font-medium text-gray-700">
        Type
      </label>
      <select
        id="type"
        v-model="type"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option disabled value="">-- Choisir un type --</option>
        <option>à faire</option>
        <option>en cours</option>
        <option>terminée</option>
      </select>
    </div>

    <div>
      <label
        for="description"
        class="block text-sm mb-1 font-medium text-gray-700"
      >
        Description
      </label>
      <textarea
        id="description"
        v-model="description"
        placeholder="Description de la tâche"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      ></textarea>
    </div>

    <div>
      <label
        for="difficulte"
        class="block text-sm mb-1 font-medium text-gray-700"
      >
        Difficulté
      </label>
      <select
        id="difficulte"
        v-model="difficulte"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option disabled value="">-- Choisir une difficulté --</option>
        <option>faible</option>
        <option>moyen</option>
        <option>difficile</option>
      </select>
    </div>

    <div>
      <label
        for="estimation"
        class="block text-sm mb-1 font-medium text-gray-700"
      >
        Estimation (en jours)
      </label>
      <input
        id="estimation"
        v-model.number="estimation"
        type="number"
        min="1"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>

    <div>
      <label for="date" class="block text-sm mb-1 font-medium text-gray-700">
        Date
      </label>
      <input
        id="date"
        v-model="date"
        type="date"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
    >
      Ajouter
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const title = ref("");
const type = ref("");
const description = ref("");
const difficulte = ref("");
const estimation = ref(null);
const date = ref("");
const router = useRouter();

const ajouterTache = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/taches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        type: type.value,
        description: description.value,
        difficulte: difficulte.value,
        estimation: estimation.value,
        date: date.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la tâche.");
    }

    router.push("/");
  } catch (err) {
    console.error(err);
    alert("Erreur: " + err.message);
  }
};
</script>
