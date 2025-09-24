/**
 * Sanitiza una URL verificando que sea válida
 */
export function sanitizeUrl(url: string): string {
  try {
    return new URL(url).toString()
  } catch {
    return '#'
  }
}

/**
 * Extrae el primer enlace válido de un texto
 */
export function extractFirstLink(text: string): string {
  if (!text) return '#'
  const match = text.match(/https?:\/\/[^\s)]+/g)
  return match && match[0] ? sanitizeUrl(match[0]) : '#'
}

/**
 * Calcula el número total de páginas
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize)
}

/**
 * Genera un array de números para la paginación
 */
export function generatePageNumbers(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, i) => i + 1)
}
