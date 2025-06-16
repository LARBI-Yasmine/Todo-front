<template>
  <nav class="bg-orange-300 p-4">
    <ul class="flex space-x-6 justify-end">
      <li>
        <NuxtLink
          to="/"
          class="text-white font-semibold hover:"
          active-class="decoration-2 decoration-white"
        >
          Liste Tâche
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/taches/Formtache"
          class="text-white font-semibold hover-orange-400"
          active-class="decoration-2 decoration-white"
        >
          Nouvelle Tâche
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/"
          class="text-white font-semibold hover:"
          active-class=" decoration-2 decoration-white"
        >
          Connexion
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
