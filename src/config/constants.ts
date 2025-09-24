import type { Asesor } from '../types'

export const API_CONFIG = {
  BASE_URL: 'https://api-ecommerce.hostinger.com/store/store_01J9S3VMVD29XN5DP0E917FH67',
  PAGE_SIZE: 9,
  HEADERS: {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
    origin: 'https://www.rrautosweb.com',
    priority: 'u=1, i',
    referer: 'https://www.rrautosweb.com/',
    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  },
} as const

export const ASESORES: Asesor[] = [
  { id: 'juli', nombre: 'Juli', inicial: 'J' },
  { id: 'leydi', nombre: 'Leydi', inicial: 'L' },
  { id: 'felipe', nombre: 'Felipe', inicial: 'F' },
  { id: 'sebas', nombre: 'Sebas', inicial: 'S' },
]
