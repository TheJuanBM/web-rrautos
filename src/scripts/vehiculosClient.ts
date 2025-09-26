import { API_CONFIG } from '../config/constants'
import type { Vehiculo } from '../types'
import {
  announceToScreenReader,
  buildOptimizedImageUrl,
  buildSrcSet,
  calculateTotalPages,
  escapeHtml,
  extractFirstLink,
  generatePageNumbers,
  resolveVehicleSlug,
  sanitizeUrl,
  toDomId,
} from '../utils'

interface VehiculosState {
  currentPage: number
  currentMarca: string
  vehiculosLista: HTMLElement | null
  paginacionDivs: HTMLElement[]
  marcaSelect: HTMLSelectElement | null
}

class VehiculosClient {
  private state: VehiculosState
  private readonly defaultCtaUrl = 'https://wa.me/51987654321'

  constructor() {
    this.state = {
      currentPage: 1,
      currentMarca: '',
      vehiculosLista: document.getElementById('vehiculos-lista'),
      paginacionDivs: Array.from(document.querySelectorAll<HTMLElement>('[data-pagination-anchor]')),
      marcaSelect: document.getElementById('marca-select') as HTMLSelectElement,
    }
  }

  private syncStateWithParams(): void {
    const searchParams = new URLSearchParams(window.location.search)
    const marcaFromUrl = searchParams.get('marca') ?? ''
    const pageFromUrl = parseInt(searchParams.get('page') ?? '1', 10)

    if (marcaFromUrl) {
      this.state.currentMarca = marcaFromUrl
      if (this.state.marcaSelect) {
        this.state.marcaSelect.value = marcaFromUrl
      }
    }

    if (!isNaN(pageFromUrl) && pageFromUrl > 0) {
      this.state.currentPage = pageFromUrl
    }
  }

  private handlePopState = (): void => {
    this.syncStateWithParams()
    this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
  }

  private updateUrlParams(): void {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    if (this.state.currentMarca) {
      url.searchParams.set('marca', this.state.currentMarca)
    } else {
      url.searchParams.delete('marca')
    }

    if (this.state.currentPage > 1) {
      url.searchParams.set('page', String(this.state.currentPage))
    } else {
      url.searchParams.delete('page')
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  private renderSkeletons(count = API_CONFIG.PAGE_SIZE): void {
    if (!this.state.vehiculosLista) return

    const skeletonHTML = Array.from({ length: count })
      .map(
        () => `
        <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm animate-pulse h-[345px] vehicle-card">
          <div class="w-full h-30 md:h-32 bg-gray-200 rounded-md"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mt-3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
          <div class="h-7 bg-gray-200 rounded-md w-24 mt-3"></div>
        </div>
      `
      )
      .join('')

    this.state.vehiculosLista.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 vehicle-card-grid">
        ${skeletonHTML}
      </div>
    `
  }

  private async fetchVehiculos(page = 1, marca = ''): Promise<void> {
    this.updateUrlParams()

    const offset = (page - 1) * API_CONFIG.PAGE_SIZE
    let url = `${API_CONFIG.BASE_URL}/products?offset=${offset}&limit=${API_CONFIG.PAGE_SIZE}&to_date=2025-06-11T19%3A11%3A06.729Z`

    if (marca && marca !== '') {
      url += `&order=ASC&sort_by=collection_order&collection_ids[]=${marca}`
    }

    this.renderSkeletons()

    try {
      const response = await fetch(url, { headers: API_CONFIG.HEADERS })
      if (!response.ok) {
        throw new Error(`Respuesta inesperada (${response.status})`)
      }
      const data = await response.json()
      this.renderVehiculos(data.products ?? [])
      this.renderPaginacion(data.count ?? 0, page)
    } catch (error) {
      console.error('Error al cargar vehículos:', error)
      this.renderError()
    }
  }

  private renderVehiculos(productos: Vehiculo[]): void {
    if (!this.state.vehiculosLista) return

    if (!productos || productos.length === 0) {
      this.state.vehiculosLista.innerHTML = `
        <div class="flex flex-col items-center justify-center text-contrast-medium gap-2 py-10">
          <svg class="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M20.92 8.78a2 2 0 0 0-1.64-.89h-2.72L14.54 5.2A3 3 0 0 0 12.07 4H8a3 3 0 0 0-2.82 2H3.72a2 2 0 0 0-1.9 2.62l1.72 6A3 3 0 0 0 6.44 17H17a3 3 0 0 0 2.83-2l1.62-4.33a2 2 0 0 0-.53-1.89ZM7 7a1 1 0 0 1 1-1h4.07a1 1 0 0 1 .76.35L14.41 8H6.28ZM17 15H6.44a1 1 0 0 1-1-.73L3.91 10h15.37Z"/>
          </svg>
          <p class="text-sm">No hay vehículos para mostrar con este filtro.</p>
        </div>
      `
      return
    }

    const vehiculosHTML = productos
      .map((vehiculo, index) => {
        const safeTitle = escapeHtml(vehiculo.title ?? 'Vehículo disponible')
        const ribbonLabel = vehiculo.ribbon_text ? escapeHtml(vehiculo.ribbon_text.trim()) : ''
        const baseImageUrl = vehiculo.thumbnail ? sanitizeUrl(vehiculo.thumbnail) : ''
        const hasImage = Boolean(baseImageUrl && baseImageUrl !== '#')
        const imageSrc = hasImage ? buildOptimizedImageUrl(baseImageUrl, 480) : ''
        const imageSrcSet = hasImage ? buildSrcSet(baseImageUrl) : ''
        const loading = index < 2 ? 'eager' : 'lazy'
        const fetchPriority = index < 2 ? 'high' : 'auto'
        const cardId = toDomId(vehiculo.id ?? safeTitle, `vehicle-${index}`)
        const extractedLink = extractFirstLink(vehiculo.description ?? '')
        const ctaHref = sanitizeUrl(extractedLink !== '#' ? extractedLink : this.defaultCtaUrl)
        const slug = resolveVehicleSlug({
          id: vehiculo.id,
          title: vehiculo.title,
          slug: vehiculo.slug,
          seo_settings: vehiculo.seo_settings,
          page_settings: vehiculo.page_settings,
        })
        const detailPath = slug ? `/vehiculos/${slug}` : ''
        const detailUrl = slug
          ? `${typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : ''}${detailPath}`
          : ''
        const contactLink = ctaHref !== '#' ? ctaHref : detailUrl || this.defaultCtaUrl
        const detailAttributes = detailPath ? ` data-detail-url="${detailPath}" tabindex="0"` : ''

        return `
          <article class="vehicle-card" role="listitem" aria-labelledby="${cardId}-title"${detailAttributes}>
            <div class="vehicle-card__media" ${hasImage ? `role="img" aria-label="Imagen de ${safeTitle}"` : 'aria-hidden="true"'}>
              ${ribbonLabel ? `<span class="vehicle-card__badge">${ribbonLabel}</span>` : ''}
              ${
                hasImage
                  ? `<img
                src="${imageSrc}"
                ${imageSrcSet ? `srcset="${imageSrcSet}"` : ''}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                alt="${safeTitle} - Vehículo usado disponible en RR Autos"
                class="vehicle-card__image"
                loading="${loading}"
                decoding="async"
                referrerpolicy="no-referrer"
                fetchpriority="${fetchPriority}"
                onerror="this.style.display='none'"
                onload="this.style.opacity='1'"
                style="opacity: 0; transition: opacity 0.3s ease-in-out;"
              />`
                  : `<div class="vehicle-card__image vehicle-card__image--empty" aria-hidden="true"></div>`
              }
              <span class="vehicle-card__glow" aria-hidden="true"></span>
            </div>

            <div class="vehicle-card__body">
              <div class="vehicle-card__info">
                <h3 id="${cardId}-title" class="vehicle-card__title">${safeTitle}</h3>
              </div>

              <div class="vehicle-card__cta-group">
                <a
                  href="${detailPath || '#'}"
                  class="vehicle-card__cta"
                  aria-label="Ver detalles de ${safeTitle}"
                >
                  <span>Ver ficha completa</span>
                  <svg class="vehicle-card__cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
                  </svg>
                </a>
                <a
                  href="${contactLink}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="vehicle-card__cta vehicle-card__cta--secondary"
                  aria-label="Contactar asesor de ${safeTitle} (se abre en nueva ventana)"
                >
                  <span>Contactar asesor</span>
                </a>
              </div>
            </div>
          </article>
        `
      })
      .join('')

    this.state.vehiculosLista.innerHTML = `
      <section class="vehicle-card-grid" role="list" aria-label="Vehículos disponibles">
        ${vehiculosHTML}
      </section>
    `

    this.attachCardNavigation()
  }

  private attachCardNavigation(): void {
    if (!this.state.vehiculosLista) return

    this.state.vehiculosLista.querySelectorAll<HTMLElement>('[data-detail-url]').forEach(card => {
      const detailUrl = card.getAttribute('data-detail-url')
      if (!detailUrl) return

      const navigateToDetail = () => {
        window.location.href = detailUrl
      }

      card.addEventListener('click', event => {
        const target = event.target as HTMLElement
        if (target.closest('a')) return
        navigateToDetail()
      })

      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigateToDetail()
        }
      })

      card.setAttribute('role', 'link')
      const titleElement = card.querySelector<HTMLElement>('.vehicle-card__title')
      if (titleElement) {
        card.setAttribute('aria-label', `Ver detalles de ${titleElement.textContent?.trim() ?? 'vehículo'}`)
      }
    })
  }

  private renderError(): void {
    if (!this.state.vehiculosLista) return

    this.state.vehiculosLista.innerHTML = `
      <div class="flex flex-col items-center justify-center text-red-500 gap-2 py-10">
        <svg class="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="text-sm">No pudimos cargar los vehículos. Actualiza la página o contáctanos si el problema persiste.</p>
      </div>
    `
  }

  private renderPaginacion(total: number, page: number): void {
    if (!this.state.paginacionDivs || this.state.paginacionDivs.length === 0) return

    const totalPages = calculateTotalPages(total, API_CONFIG.PAGE_SIZE)

    if (totalPages <= 1) {
      this.state.paginacionDivs.forEach(div => (div.innerHTML = ''))
      return
    }

    const pageNumbers = generatePageNumbers(totalPages, page)
    const prevDisabled = page === 1
    const nextDisabled = page === totalPages

    const buttonsHTML = pageNumbers
      .map(pageNumber => {
        if (pageNumber === -1) {
          return `<span class="pagination__ellipsis" aria-hidden="true">…</span>`
        }

        const isActive = page === pageNumber

        return `
          <button class="pagination__item${isActive ? ' is-active' : ''}" ${isActive ? "disabled='true'" : ''} data-page="${pageNumber}" data-pagination="true" aria-current="${isActive ? 'page' : 'false'}">
            ${pageNumber}
          </button>
        `
      })
      .join('')

    const paginationHTML = `
      <nav class="pagination" role="navigation" aria-label="Paginación de resultados">
        <button class="pagination__control${prevDisabled ? ' is-disabled' : ''}" data-act="prev" ${prevDisabled ? 'disabled' : ''} data-pagination="true" aria-label="Página anterior">
          <span aria-hidden="true">‹</span>
        </button>
        ${buttonsHTML}
        <button class="pagination__control${nextDisabled ? ' is-disabled' : ''}" data-act="next" ${nextDisabled ? 'disabled' : ''} data-pagination="true" aria-label="Página siguiente">
          <span aria-hidden="true">›</span>
        </button>
      </nav>
    `
    this.state.paginacionDivs.forEach(div => {
      div.innerHTML = paginationHTML
    })

    this.attachPaginationEvents(totalPages)
  }

  private attachPaginationEvents(totalPages: number): void {
    if (!this.state.paginacionDivs || this.state.paginacionDivs.length === 0) return

    const bindEvents = (container: HTMLElement) => {
      container.querySelectorAll('[data-page]').forEach(btn => {
        const pageAttr = btn.getAttribute('data-page')
        if (pageAttr) {
          btn.addEventListener('click', () => {
            const newPage = parseInt(pageAttr)
            if (!isNaN(newPage)) {
              this.state.currentPage = newPage
              this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
            }
          })
        }
      })

      const prevBtn = container.querySelector('[data-act="prev"]')
      prevBtn?.addEventListener('click', () => {
        if (this.state.currentPage > 1) {
          this.state.currentPage--
          this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
        }
      })

      const nextBtn = container.querySelector('[data-act="next"]')
      nextBtn?.addEventListener('click', () => {
        if (this.state.currentPage < totalPages) {
          this.state.currentPage++
          this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
        }
      })
    }

    this.state.paginacionDivs.forEach(bindEvents)
  }

  public init(): void {
    // Event listener para selector de marcas
    this.state.marcaSelect?.addEventListener('change', e => {
      const target = e.target as HTMLSelectElement
      this.state.currentMarca = target.value
      this.state.currentPage = 1
      this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)

      announceToScreenReader(`Filtro aplicado: ${target.options[target.selectedIndex].text}. Cargando vehículos...`)
    })

    // Navegación por teclado
    this.setupKeyboardNavigation()

    // Carga inicial
    this.renderSkeletons()
    this.syncStateWithParams()
    this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
    window.addEventListener('popstate', this.handlePopState)
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', e => {
      // Navegación con flechas en la paginación
      if (e.target && (e.target as HTMLElement).hasAttribute('data-pagination')) {
        this.handlePaginationKeydown(e)
      }
    })
  }

  private handlePaginationKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        this.focusSiblingButton(target, 'previous')
        break

      case 'ArrowRight':
        e.preventDefault()
        this.focusSiblingButton(target, 'next')
        break

      case 'Home':
        e.preventDefault()
        this.focusBoundaryButton('first')
        break

      case 'End':
        e.preventDefault()
        this.focusBoundaryButton('last')
        break
    }
  }

  private focusSiblingButton(target: HTMLElement, direction: 'previous' | 'next'): void {
    const siblingProp = direction === 'previous' ? 'previousElementSibling' : 'nextElementSibling'
    const sibling = target[siblingProp] as HTMLButtonElement | null

    if (sibling && !sibling.disabled) {
      sibling.focus()
    }
  }

  private focusBoundaryButton(position: 'first' | 'last'): void {
    if (!this.state.paginacionDivs || this.state.paginacionDivs.length === 0) return

    const primaryContainer = this.state.paginacionDivs[0]
    if (!primaryContainer) return

    const buttons = Array.from(primaryContainer.querySelectorAll<HTMLButtonElement>('[data-page]'))
    if (buttons.length === 0) return

    const target = position === 'first' ? buttons[0] : buttons[buttons.length - 1]
    target.focus()
  }
}

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  const catalogo = new VehiculosClient()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => catalogo.init())
  } else {
    catalogo.init()
  }
}
