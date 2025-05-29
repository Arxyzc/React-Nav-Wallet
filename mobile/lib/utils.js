// lib/utils.js
export function formatDate(dateString) {
  // Formatear fecha en español de México
  // ejemplo: de esto 👉 2025-05-20 a esto 👉 20 de mayo de 2025
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}