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
export function generatePageNumbers(totalPages: number, currentPage: number): number[] {
  if (totalPages <= 0) return []

  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: number[] = []
  const safeCurrent = Math.min(Math.max(currentPage, 1), totalPages)
  const edgeCount = 6

  const firstPages = Array.from({ length: edgeCount }, (_, i) => i + 1)
  const lastPagesStart = Math.max(totalPages - (edgeCount - 1), 1)
  const lastPages = Array.from({ length: totalPages - lastPagesStart + 1 }, (_, i) => lastPagesStart + i)

  if (safeCurrent <= edgeCount - 2) {
    pages.push(...firstPages, -1, totalPages)
    return dedupeWithinBounds(pages, totalPages)
  }

  if (safeCurrent >= totalPages - (edgeCount - 3)) {
    pages.push(1, -1, ...lastPages)
    return dedupeWithinBounds(pages, totalPages)
  }

  const middleStart = Math.max(safeCurrent - 2, 2)
  const middleEnd = Math.min(safeCurrent + 2, totalPages - 1)

  const middlePages = Array.from({ length: middleEnd - middleStart + 1 }, (_, i) => middleStart + i)

  pages.push(1, -1, ...middlePages, -1, totalPages)

  return dedupeWithinBounds(pages, totalPages)
}

function dedupeWithinBounds(pages: number[], totalPages: number): number[] {
  const seen = new Set<number>()
  const result: number[] = []

  for (const page of pages) {
    if (page === -1) {
      if (result[result.length - 1] !== -1) {
        result.push(-1)
      }
      continue
    }

    if (page < 1 || page > totalPages) continue
    if (seen.has(page)) continue

    seen.add(page)
    result.push(page)
  }

  if (result[0] !== 1) {
    result.unshift(1)
  }

  if (result[result.length - 1] !== totalPages) {
    result.push(totalPages)
  }

  return result
}

export function escapeHtml(value: string): string {
  if (!value) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, char => map[char] ?? char)
}

export function toDomId(value: string, fallback: string): string {
  if (!value) return fallback

  try {
    const normalized = value
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

    return normalized || fallback
  } catch (error) {
    console.warn('No se pudo normalizar el ID del elemento:', error)
    return fallback
  }
}

export function buildOptimizedImageUrl(baseSrc: string, width: number, quality = 80): string {
  return `${baseSrc}?w=${width}&q=${quality}`
}

export function buildSrcSet(baseSrc: string, quality = 80, widths: number[] = [320, 640, 768, 1024, 1280]): string {
  return widths.map(w => `${baseSrc}?w=${w}&q=${quality} ${w}w`).join(', ')
}

export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}
