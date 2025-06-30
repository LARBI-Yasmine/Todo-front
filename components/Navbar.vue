<script setup>
const auth = useAuthStore();
const router = useRouter();
const { isLoggedIn } = storeToRefs(auth);

const logOut = async () => {
  await auth.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="bg-orange-300 p-4">
    <ul class="flex flex-row-reverse items-center gap-4">
      <div v-if="!isLoggedIn" class="flex gap-2">
        <li>
          <NuxtLink to="/login" class="text-white hover:text-gray-300"
            >Connexion</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/register" class="text-white hover:text-gray-300"
            >Inscription</NuxtLink
          >
        </li>
      </div>
      <div v-else class="flex gap-2">
        <li>
          <NuxtLink
            to="/taches/FormTache"
            class="text-white hover:text-gray-300"
            >Nouvelle tâche</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/ListTache" class="text-white hover:text-gray-300"
            >Liste des tâches</NuxtLink
          >
        </li>
        <li
          class="text-white hover:text-gray-300 cursor-pointer"
          @click="logOut"
        >
          Déconnexion
        </li>
      </div>
    </ul>
  </nav>
</template>
