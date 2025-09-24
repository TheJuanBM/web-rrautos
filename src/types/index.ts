export interface Marca {
  id: string
  title: string
}

export interface Vehiculo {
  id: string
  title: string
  description: string
  thumbnail: string
  ribbon_text?: string
}

export interface ApiResponse<T> {
  data?: T
  products?: Vehiculo[]
  collections?: Marca[]
  count?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  marca?: string
}

export interface Asesor {
  id: string
  nombre: string
  inicial: string
}
