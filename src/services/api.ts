import { API_CONFIG } from '../config/constants'
import type { ApiResponse, Marca, PaginationParams, Vehiculo, VehiculoDetalle } from '../types'
import { resolveVehicleSlug } from '../utils'

class ApiService {
  private baseUrl: string
  private headers: Record<string, string>
  private slugCache = new Map<string, string>()

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.headers = API_CONFIG.HEADERS
  }

  private async makeRequest<T>(url: string, { retries = 2 } = {}): Promise<T> {
    let lastError: unknown

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(url, { headers: this.headers })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        lastError = error
        if (attempt < retries) {
          const waitTime = 2 ** attempt * 150
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }

    console.error('Error en la petición API:', lastError)
    throw lastError
  }

  async fetchMarcas(): Promise<Marca[]> {
    const url = `${this.baseUrl}/collections`
    const data = await this.makeRequest<ApiResponse<Marca[]>>(url)
    return (data.collections ?? []).sort((a, b) => a.title.localeCompare(b.title))
  }

  async fetchVehiculos({ page, pageSize, marca }: PaginationParams): Promise<{ vehiculos: Vehiculo[]; total: number }> {
    const offset = (page - 1) * pageSize
    let url = `${this.baseUrl}/products?offset=${offset}&limit=${pageSize}&to_date=2025-06-11T19%3A11%3A06.729Z`

    if (marca && marca !== '') {
      url += `&order=ASC&sort_by=collection_order&collection_ids[]=${marca}`
    }

    try {
      const data = await this.makeRequest<ApiResponse<Vehiculo[]>>(url)
      return {
        vehiculos: data.products ?? [],
        total: data.count ?? 0,
      }
    } catch (error) {
      return {
        vehiculos: [],
        total: 0,
      }
    }
  }

  async fetchVehiculoById(id: string): Promise<VehiculoDetalle> {
    const url = `${this.baseUrl}/products/${id}`
    const data = await this.makeRequest<{ product: VehiculoDetalle }>(url)
    return data.product
  }

  async fetchVehiculoBySlug(slug: string): Promise<VehiculoDetalle | null> {
    const normalizedSlug = slug.toLowerCase()
    const cachedId = this.slugCache.get(normalizedSlug)

    if (cachedId) {
      try {
        return await this.fetchVehiculoById(cachedId)
      } catch (error) {
        console.warn('El ID en caché no es válido, se recargará el slug:', error)
        this.slugCache.delete(normalizedSlug)
      }
    }

    const pageSize = Math.max(API_CONFIG.PAGE_SIZE, 30)
    let page = 1

    while (true) {
      const { vehiculos, total = 0 } = await this.fetchVehiculos({ page, pageSize })

      if (!vehiculos || vehiculos.length === 0) {
        break
      }

      for (const vehiculo of vehiculos) {
        const vehiculoSlug = resolveVehicleSlug(vehiculo).toLowerCase()
        this.slugCache.set(vehiculoSlug, vehiculo.id)

        if (vehiculoSlug === normalizedSlug) {
          return await this.fetchVehiculoById(vehiculo.id)
        }
      }

      const totalPages = Math.ceil(total / pageSize)
      if (!totalPages || page >= totalPages) {
        break
      }

      page += 1
    }

    return null
  }
}

export const apiService = new ApiService()
