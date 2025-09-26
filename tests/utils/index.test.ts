import { describe, expect, it } from 'vitest'

import {
  buildOptimizedImageUrl,
  buildPaginationSequence,
  buildSrcSet,
  calculateTotalPages,
  escapeHtml,
  sanitizeUrl,
  slugify,
  extractFirstLink,
  toDomId,
  resolveVehicleSlug,
} from '../../src/utils/index'

describe('utils', () => {
  describe('sanitizeUrl', () => {
    it('normaliza URLs válidas', () => {
      expect(sanitizeUrl('https://example.com/foo?bar=baz')).toBe('https://example.com/foo?bar=baz')
    })

    it('retorna # cuando la URL es inválida', () => {
      expect(sanitizeUrl('notaurl')).toBe('#')
    })
  })

  describe('extractFirstLink', () => {
    it('devuelve el primer enlace válido en un texto', () => {
      const text = 'Más info en https://rr-autos.com y https://otro.enlace.com'
      expect(extractFirstLink(text)).toBe('https://rr-autos.com/')
    })

    it('retorna # cuando no hay enlaces', () => {
      expect(extractFirstLink('sin links')).toBe('#')
    })
  })

  describe('calculateTotalPages', () => {
    it('calcula páginas con valores positivos', () => {
      expect(calculateTotalPages(27, 9)).toBe(3)
    })

    it('retorna 0 cuando pageSize es 0 o negativo', () => {
      expect(calculateTotalPages(10, 0)).toBe(0)
      expect(calculateTotalPages(10, -5)).toBe(0)
    })

    it('retorna 0 cuando total es 0 o negativo', () => {
      expect(calculateTotalPages(0, 5)).toBe(0)
      expect(calculateTotalPages(-10, 5)).toBe(0)
    })
  })

  describe('buildPaginationSequence', () => {
    it('devuelve secuencia simple cuando hay pocas páginas', () => {
      expect(buildPaginationSequence(5, 1)).toEqual([1, 2, 3, 4, 5])
    })

    it('coloca elipses cuando hay huecos grandes', () => {
      expect(buildPaginationSequence(15, 8)).toEqual([1, 2, 3, -1, 6, 7, 8, 9, 10, -1, 13, 14, 15])
    })

    it('controla que el número actual fuera de rango se normalice', () => {
      expect(buildPaginationSequence(10, 900)).toEqual([1, 2, 3, -1, 8, 9, 10])
      expect(buildPaginationSequence(10, -3)).toEqual([1, 2, 3, -1, 8, 9, 10])
    })
  })

  describe('escapeHtml', () => {
    it('escapa caracteres problemáticos', () => {
      expect(escapeHtml('<div>"&')).toBe('&lt;div&gt;&quot;&amp;')
    })

    it('retorna string vacío cuando recibe string vacío', () => {
      expect(escapeHtml('')).toBe('')
    })
  })

  describe('toDomId', () => {
    it('normaliza strings con caracteres especiales', () => {
      expect(toDomId('Nombre de Vehículo 2024', 'fallback')).toBe('nombre-de-vehiculo-2024')
    })

    it('retorna fallback cuando la cadena está vacía', () => {
      expect(toDomId('', 'fallback')).toBe('fallback')
    })
  })

  describe('buildOptimizedImageUrl', () => {
    it('añade parámetros de optimización a la URL', () => {
      expect(buildOptimizedImageUrl('https://cdn.com/image.jpg', 640)).toBe('https://cdn.com/image.jpg?w=640&q=80')
    })
  })

  describe('buildSrcSet', () => {
    it('genera un srcset con anchos predefinidos', () => {
      expect(buildSrcSet('https://cdn.com/image.jpg', 75, [320, 640])).toBe(
        'https://cdn.com/image.jpg?w=320&q=75 320w, https://cdn.com/image.jpg?w=640&q=75 640w'
      )
    })
  })

  describe('slugify', () => {
    it('genera slugs legibles', () => {
      expect(slugify('Ford F-150 Lariat')).toBe('ford-f-150-lariat')
    })

    it('maneja entradas con acentos', () => {
      expect(slugify('Café con azúcar')).toBe('cafe-con-azucar')
    })
  })

  describe('resolveVehicleSlug', () => {
    it('prioriza el slug personalizado cuando está disponible', () => {
      const vehiculo = {
        id: '1',
        title: 'Ford Fiesta',
        slug: 'fiesta-2024',
        seo_settings: { slug: 'seo-fiesta' },
        page_settings: { seoSlug: 'page-fiesta' },
      }

      expect(resolveVehicleSlug(vehiculo)).toBe('page-fiesta')
    })

    it('usa el id como último recurso', () => {
      const vehiculo = {
        id: '123',
      }

      expect(resolveVehicleSlug(vehiculo)).toBe('123')
    })
  })
})


