export interface Marca {
  id: string
  title: string
}

export interface VehiculoMedia {
  id: string
  url: string
  order: number
  type?: string
  display_slot?: string
}

export interface VehiculoSeoSettings {
  slug?: string | null
  description?: string | null
  ogImagePath?: string | null
  ogImageAlt?: string | null
  ogImageOrigin?: string | null
}

export interface VehiculoPageSettings {
  seoSlug?: string | null
  seoDescription?: string | null
  seoOgImagePath?: string | null
  seoOgImageAlt?: string | null
  seoOgImageOrigin?: string | null
}

export interface VehiculoAdditionalInfo {
  id?: string
  label?: string
  value?: string
  description?: string
}

export interface VehiculoVariant {
  id: string
  title: string
  sku: string | null
  inventory_quantity: number
}

export interface Vehiculo {
  id: string
  title: string
  description?: string | null
  thumbnail?: string | null
  ribbon_text?: string | null
  slug?: string | null
  subtitle?: string | null
  status?: string | null
  purchasable?: boolean
  media?: VehiculoMedia[]
  seo_settings?: VehiculoSeoSettings | null
  page_settings?: VehiculoPageSettings | null
  additional_info?: VehiculoAdditionalInfo[]
  variants?: VehiculoVariant[]
}

export interface VehiculoDetalle extends Vehiculo {}

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
