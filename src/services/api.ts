import type { Marca, Vehiculo, ApiResponse, PaginationParams } from '../types'
import { API_CONFIG } from '../config/constants'

class ApiService {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.headers = API_CONFIG.HEADERS
  }

  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error en la petición API:', error)
      throw error
    }
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

    const data = await this.makeRequest<ApiResponse<Vehiculo[]>>(url)
    return {
      vehiculos: data.products ?? [],
      total: data.count ?? 0,
    }
  }
}

export const apiService = new ApiService()
