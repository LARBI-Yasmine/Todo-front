<template>
  <div
    class="bg-white border border-gray-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-gray-900">{{ tache.title }}</h3>
      <span
        :class="badgeClass(tache.type)"
        class="px-3 py-1 text-xs rounded-full font-semibold"
      >
        {{ tache.type }}
      </span>
    </div>

    <p class="text-sm text-gray-700 mb-1">
      <span class="font-medium text-gray-500">Estimation:</span>
      {{ tache.estimation }} jour<span v-if="tache.estimation > 1">s</span>
    </p>

    <p class="text-sm text-gray-700 mb-3">
      <span class="font-medium text-gray-500">Date:</span>
      <time :datetime="tache.date">
        {{ formatDate(tache.date) }}
      </time>
    </p>

    <NuxtLink
      :to="`/taches/${tache._id}`"
      class="inline-block mt-3 px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-600 transition"
    >
      Détail
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  tache: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const badgeClass = (type) => {
  switch (type) {
    case "terminée":
      return "bg-green-100 text-green-700";
    case "en cours":
      return "bg-yellow-100 text-yellow-700";
    case "à faire":
    default:
      return "bg-red-100 text-red-700";
  }
};
</script>
