export function getPublicEnv() {
  return {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  }
}