<script setup>
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <ul class="flex flex-row-reverse items-center gap-4">
      <li>
        <NuxtLink to="/login" class="text-white hover:text-gray-300"
          >Connexion</NuxtLink
        >
      </li>
      <li>
        <NuxtLink to="/Register" class="text-white hover:text-gray-300"
          >Inscription</NuxtLink
        >
      </li>

      <li>
        <NuxtLink to="/taches/FormTache" class="text-white hover:text-gray-300"
          >Nouvelle tâche</NuxtLink
        >
      </li>
      <li>
        <NuxtLink to="/ListTache" class="text-white hover:text-gray-300"
          >Liste des tâches</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>
