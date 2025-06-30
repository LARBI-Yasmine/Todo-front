export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const isPublic = ['/login', '/register'].includes(to.path)

  if (!auth.isLoggedIn && !isPublic) {
    return navigateTo('/login')
  }
})
