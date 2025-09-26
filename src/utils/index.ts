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
  if (pageSize <= 0) return 0
  if (total <= 0) return 0
  return Math.ceil(total / pageSize)
}

/**
 * Genera un array de números para la paginación
 */
export function buildPaginationSequence(totalPages: number, currentPage: number): number[] {
  if (totalPages <= 0) return []

  const safeCurrent = Math.min(Math.max(currentPage, 1), totalPages)
  const sequence = new Set<number>()
  const pushWithinBounds = (...values: number[]) => {
    for (const value of values) {
      if (value >= 1 && value <= totalPages) {
        sequence.add(value)
      }
    }
  }

  pushWithinBounds(1, totalPages)

  if (totalPages <= 9) {
    for (let i = 2; i < totalPages; i += 1) {
      pushWithinBounds(i)
    }
    return Array.from(sequence).sort((a, b) => a - b)
  }

  pushWithinBounds(safeCurrent - 2, safeCurrent - 1, safeCurrent, safeCurrent + 1, safeCurrent + 2)
  pushWithinBounds(2, 3, totalPages - 2, totalPages - 1)

  const sorted = Array.from(sequence).sort((a, b) => a - b)
  const result: number[] = []

  for (let i = 0; i < sorted.length; i += 1) {
    const value = sorted[i]
    result.push(value)

    const nextValue = sorted[i + 1]
    if (nextValue != null && nextValue - value > 1) {
      result.push(-1)
    }
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
      .replace(/[\u0300-\u036f]/g, '')
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

export function slugify(value: string | null | undefined): string {
  if (!value) return ''

  try {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
  } catch {
    return String(value)
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
  }
}

export function resolveVehicleSlug(vehiculo: {
  id: string
  title?: string | null
  slug?: string | null
  seo_settings?: { slug?: string | null } | null
  page_settings?: { seoSlug?: string | null } | null
}): string {
  const candidates = [
    vehiculo.page_settings?.seoSlug,
    vehiculo.seo_settings?.slug,
    vehiculo.slug,
    vehiculo.title,
    vehiculo.id,
  ]

  for (const candidate of candidates) {
    const normalized = slugify(candidate)
    if (normalized) return normalized
  }

  return slugify(`${vehiculo.title ?? 'vehiculo'}-${vehiculo.id}`) || vehiculo.id
}
