
<template>
  <h2 class="text-2xl mt-4 font-bold text-center text-gray-800">
    Ajouter une tâche
  </h2>
  <form
    @submit.prevent="ajouterTache"
    class="bg-white p-6 rounded-2xl min-h-[50vh] shadow-md w-full max-w-2xl mx-auto space-y-4"
  >
    <div>
      <label for="title" class="block text-sm mb-6 font-medium text-gray-700"
        >Titre</label
      >
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Titre de la tâche"
        required
        class="mt-1 w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
      />
    </div>

    <div>
      <label for="date" class="block mb-6 text-sm font-medium text-gray-700"
        >Date</label
      >
      <input
        id="date"
        v-model="date"
        type="date"
        required
        class="mt-1 w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 mb-6 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
    >
      Ajouter
    </button>
  </form>
</template>





<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const title = ref("");
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
