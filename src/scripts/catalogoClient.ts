import type { Vehiculo } from '../types'
import { API_CONFIG } from '../config/constants'
import { extractFirstLink, calculateTotalPages, generatePageNumbers } from '../utils'

interface CatalogoState {
  currentPage: number
  currentMarca: string
  vehiculosLista: HTMLElement | null
  paginacionDiv: HTMLElement | null
  marcaSelect: HTMLSelectElement | null
}

class CatalogoClient {
  private state: CatalogoState

  constructor() {
    this.state = {
      currentPage: 1,
      currentMarca: '',
      vehiculosLista: document.getElementById('vehiculos-lista'),
      paginacionDiv: document.getElementById('paginacion'),
      marcaSelect: document.getElementById('marca-select') as HTMLSelectElement,
    }
  }

  private generateOptimizedImageUrl(baseSrc: string, width: number, quality = 80): string {
    return `${baseSrc}?w=${width}&q=${quality}`
  }

  private generateSrcSet(baseSrc: string, quality = 80): string {
    const widths = [320, 640, 768, 1024, 1280]
    return widths.map(w => `${baseSrc}?w=${w}&q=${quality} ${w}w`).join(', ')
  }

  private renderSkeletons(count = API_CONFIG.PAGE_SIZE): void {
    if (!this.state.vehiculosLista) return

    const skeletonHTML = Array.from({ length: count })
      .map(
        () => `
        <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm animate-pulse">
          <div class="w-full h-28 md:h-32 bg-gray-200 rounded-md"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mt-3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
          <div class="h-7 bg-gray-200 rounded-md w-24 mt-3"></div>
        </div>
      `
      )
      .join('')

    this.state.vehiculosLista.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        ${skeletonHTML}
      </div>
    `
  }

  private async fetchVehiculos(page = 1, marca = ''): Promise<void> {
    const offset = (page - 1) * API_CONFIG.PAGE_SIZE
    let url = `${API_CONFIG.BASE_URL}/products?offset=${offset}&limit=${API_CONFIG.PAGE_SIZE}&to_date=2025-06-11T19%3A11%3A06.729Z`

    if (marca && marca !== '') {
      url += `&order=ASC&sort_by=collection_order&collection_ids[]=${marca}`
    }

    this.renderSkeletons()

    try {
      const response = await fetch(url, { headers: API_CONFIG.HEADERS })
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
      .map(
        vehiculo => `
        <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <div class="w-full h-28 md:h-32 relative overflow-hidden rounded-md bg-gray-100">
            ${vehiculo.ribbon_text ? `<span class="absolute top-2 right-2 bg-green-600 text-[11px] font-bold px-2 py-0.5 rounded-full shadow">${vehiculo.ribbon_text}</span>` : ''}
            <img
              src="${this.generateOptimizedImageUrl(vehiculo.thumbnail, 320)}"
              srcset="${this.generateSrcSet(vehiculo.thumbnail)}"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt="${vehiculo.title} - Vehículo usado disponible en RR Autos"
              class="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              onerror="this.style.display='none'"
              onload="this.style.opacity='1'"
              style="opacity: 0; transition: opacity 0.3s ease-in-out;"
            />
          </div>
          <h3 class="mt-2 text-sm font-semibold">${vehiculo.title}</h3>
          <a href="${extractFirstLink(vehiculo.description)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium mt-1">
            Ver más
            <svg class="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
            </svg>
          </a>
        </div>
      `
      )
      .join('')

    this.state.vehiculosLista.innerHTML = `
      <div class="mb-4">
        <h2 class="text-xl font-bold text-contrast-high mb-4 sr-only">Vehículos Disponibles</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          ${vehiculosHTML}
        </div>
      </div>
    `
  }

  private renderError(): void {
    if (!this.state.vehiculosLista) return

    this.state.vehiculosLista.innerHTML = `
      <div class="flex flex-col items-center justify-center text-red-500 gap-2 py-10">
        <svg class="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="text-sm">Error al cargar los vehículos. Por favor, intenta de nuevo.</p>
      </div>
    `
  }

  private renderPaginacion(total: number, page: number): void {
    if (!this.state.paginacionDiv) return

    const totalPages = calculateTotalPages(total, API_CONFIG.PAGE_SIZE)

    if (totalPages <= 1) {
      this.state.paginacionDiv.innerHTML = ''
      return
    }

    const pageNumbers = generatePageNumbers(totalPages)
    const prevDisabled = page === 1
    const nextDisabled = page === totalPages

    let html = `
      <button class="px-3 py-1.5 rounded-md border bg-white  text-contrast-high border-gray-300  hover:bg-gray-50  text-sm font-medium${prevDisabled ? ' opacity-50 cursor-not-allowed' : ''}" 
              data-act="prev" ${prevDisabled ? 'disabled' : ''}>
        Anterior
      </button>
    `

    html += pageNumbers
      .map(
        pageNumber => `
        <button class="px-3 py-1.5 rounded-md border text-sm font-medium${page === pageNumber ? ' bg-blue-600 border-blue-600 hover:bg-blue-700 text-white' : ' bg-white  text-contrast-high border-gray-300  hover:bg-gray-50 '}"
                data-page="${pageNumber}">
          ${pageNumber}
        </button>
      `
      )
      .join('')

    html += `
      <button class="px-3 py-1.5 rounded-md border bg-white  text-contrast-high border-gray-300  hover:bg-gray-50  text-sm font-medium${nextDisabled ? ' opacity-50 cursor-not-allowed' : ''}"
              data-act="next" ${nextDisabled ? 'disabled' : ''}>
        Siguiente
      </button>
    `

    this.state.paginacionDiv.innerHTML = html
    this.attachPaginationEvents(totalPages)
  }

  private attachPaginationEvents(totalPages: number): void {
    if (!this.state.paginacionDiv) return

    // Eventos para botones de página específica
    this.state.paginacionDiv.querySelectorAll('[data-page]').forEach(btn => {
      const pageAttr = btn.getAttribute('data-page')
      if (pageAttr) {
        btn.addEventListener('click', () => {
          const newPage = parseInt(pageAttr)
          if (!isNaN(newPage)) {
            this.state.currentPage = newPage
            this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
            this.scrollToPagination()
          }
        })
      }
    })

    // Botón anterior
    const prevBtn = this.state.paginacionDiv.querySelector('[data-act="prev"]')
    prevBtn?.addEventListener('click', () => {
      if (this.state.currentPage > 1) {
        this.state.currentPage--
        this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
        this.scrollToPagination()
      }
    })

    // Botón siguiente
    const nextBtn = this.state.paginacionDiv.querySelector('[data-act="next"]')
    nextBtn?.addEventListener('click', () => {
      if (this.state.currentPage < totalPages) {
        this.state.currentPage++
        this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
        this.scrollToPagination()
      }
    })
  }

  private scrollToPagination(): void {
    this.state.paginacionDiv?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  public init(): void {
    // Event listener para selector de marcas
    this.state.marcaSelect?.addEventListener('change', e => {
      const target = e.target as HTMLSelectElement
      this.state.currentMarca = target.value
      this.state.currentPage = 1
      this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)

      // Anunciar cambio para screen readers
      this.announceToScreenReader(
        `Filtro aplicado: ${target.options[target.selectedIndex].text}. Cargando vehículos...`
      )
    })

    // Navegación por teclado
    this.setupKeyboardNavigation()

    // Registrar Service Worker
    this.registerServiceWorker()

    // Carga inicial
    this.renderSkeletons()
    this.fetchVehiculos(this.state.currentPage, this.state.currentMarca)
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
        const prevBtn = target.previousElementSibling as HTMLButtonElement
        if (prevBtn && !prevBtn.disabled) {
          prevBtn.focus()
        }
        break

      case 'ArrowRight':
        e.preventDefault()
        const nextBtn = target.nextElementSibling as HTMLButtonElement
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.focus()
        }
        break

      case 'Home':
        e.preventDefault()
        const firstBtn = this.state.paginacionDiv?.querySelector('[data-page="1"]') as HTMLButtonElement
        if (firstBtn) firstBtn.focus()
        break

      case 'End':
        e.preventDefault()
        const lastPageBtn = Array.from(
          this.state.paginacionDiv?.querySelectorAll('[data-page]') || []
        ).pop() as HTMLButtonElement
        if (lastPageBtn) lastPageBtn.focus()
        break
    }
  }

  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remover después de anunciar
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')

        // Detectar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Mostrar notificación de actualización disponible
                this.showUpdateNotification()
              }
            })
          }
        })
      } catch (error) {
        console.error('Error registrando Service Worker:', error)
      }
    }
  }

  private showUpdateNotification(): void {
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-blue-600 p-4 rounded-lg shadow-lg z-50'
    notification.innerHTML = `
      <p class="mb-2">Nueva versión disponible</p>
      <button class="bg-white text-blue-700 px-3 py-1 rounded text-sm font-medium border border-blue-200" onclick="window.location.reload()">
        Actualizar
      </button>
    `
    document.body.appendChild(notification)

    // Auto-remover después de 10 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 10000)
  }
}

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  const catalogo = new CatalogoClient()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => catalogo.init())
  } else {
    catalogo.init()
  }
}
