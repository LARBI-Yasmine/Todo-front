<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"; // adapte le chemin si nécessaire

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

const submit = async () => {
  error.value = null;
  loading.value = true;

  if (!email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs.";
    loading.value = false;
    return;
  }

  try {
    await auth.login(email.value, password.value);
    router.push("/ListTache");
  } catch (err: any) {
    error.value = err.message || "Échec de la connexion.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1 class="text-2xl font-bold mb-3 mt-8 text-center">Connexion</h1>
  <div>
    <form
      @submit.prevent="submit"
      class="bg-white p-6 rounded-2xl min-h-[50vh] shadow-md w-full max-w-2xl mx-auto space-y-4"
    >
      <div>
        <label
          for="email"
          class="block text-sm mb-3 mt-4 font-medium text-gray-700"
          >Email</label
        >
        <input
          id="email"
          type="email"
          v-model="email"
          class="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg"
          placeholder="exemple@mail.com"
          required
        />
      </div>

      <div>
        <label
          for="password"
          class="block text-sm mb-3 font-medium text-gray-700"
          >Mot de passe</label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          class="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
          placeholder="Mot de passe"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 mt-4 rounded-lg transition-colors"
        >
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
      </div>

      <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
      <p class="text-center text-sm text-gray-600 mb-6">
        Vous n'avez pas de compte ?
        <NuxtLink
          to="/register"
          class="text-blue-600 hover:underline font-medium"
        >
          Inscrivez-vous ici
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
