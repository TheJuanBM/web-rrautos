import type { Asesor } from '../types'

const BASE_HEADERS: Record<string, string> = {
  accept: 'application/json',
  'accept-language': 'en-US,en;q=0.9,es;q=0.8',
}

const SSR_ONLY_HEADERS: Record<string, string> = {
  priority: 'u=1, i',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
}

const HEADERS = import.meta.env.SSR ? { ...BASE_HEADERS, ...SSR_ONLY_HEADERS } : BASE_HEADERS

export const API_CONFIG = {
  BASE_URL:
    import.meta.env.PUBLIC_API_BASE_URL || 'https://api-ecommerce.hostinger.com/store/store_01J9S3VMVD29XN5DP0E917FH67',
  PAGE_SIZE: 9,
  TO_DATE: import.meta.env.PUBLIC_API_TO_DATE || '2025-06-11T19:11:06.729Z',
  HEADERS,
}

export const ASESORES: Asesor[] = [
  { id: 'juli', nombre: 'Juli', inicial: 'J' },
  { id: 'leydi', nombre: 'Leydi', inicial: 'L' },
  { id: 'felipe', nombre: 'Felipe', inicial: 'F' },
  { id: 'sebas', nombre: 'Sebas', inicial: 'S' },
]
