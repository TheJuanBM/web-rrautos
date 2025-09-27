import type { APIRoute } from 'astro'
import { apiService } from '../services/api'
import { resolveVehicleSlug } from '../utils'

const SITE_ORIGIN = new URL(import.meta.env.PUBLIC_SITE_URL ?? 'https://rrautos.club').origin

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

function formatDate(value: Date | string | undefined): string | undefined {
  if (!value) return undefined
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().split('T')[0]
}

async function buildVehicleEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  const pageSize = 100
  let page = 1

  while (true) {
    const { vehiculos, total } = await apiService.fetchVehiculos({ page, pageSize })
    if (!vehiculos.length) break

    for (const vehiculo of vehiculos) {
      entries.push({
        loc: `${SITE_ORIGIN}/vehiculos/${resolveVehicleSlug(vehiculo)}`,
        lastmod: formatDate((vehiculo as any).updated_at ?? (vehiculo as any).created_at),
        changefreq: 'weekly',
        priority: 0.7,
      })
    }

    const totalPages = Math.ceil(total / pageSize)
    if (!totalPages || page >= totalPages) break
    page += 1
  }

  return entries
}

async function buildBrandEntries(): Promise<SitemapEntry[]> {
  try {
    const marcas = await apiService.fetchMarcas()
    return marcas.map(marca => ({
      loc: `${SITE_ORIGIN}/vehiculos?marca=${encodeURIComponent(marca.id)}`,
      changefreq: 'weekly',
      priority: 0.6,
    }))
  } catch (error) {
    console.warn('[sitemap] No se pudieron cargar marcas', error)
    return []
  }
}

const staticEntries: SitemapEntry[] = [
  {
    loc: `${SITE_ORIGIN}/`,
    changefreq: 'weekly',
    priority: 1,
  },
  {
    loc: `${SITE_ORIGIN}/vehiculos`,
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: `${SITE_ORIGIN}/servicios`,
    changefreq: 'monthly',
    priority: 0.6,
  },
]

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(({ loc, lastmod, changefreq, priority }) => {
      const rows = [`<loc>${loc}</loc>`]
      if (lastmod) rows.push(`<lastmod>${lastmod}</lastmod>`)
      if (changefreq) rows.push(`<changefreq>${changefreq}</changefreq>`)
      if (priority != null) rows.push(`<priority>${priority.toFixed(1)}</priority>`)
      return `  <url>\n    ${rows.join('\n    ')}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

export const GET: APIRoute = async ({ request }) => {
  if (request.headers.get('accept')?.includes('application/json')) {
    return new Response(JSON.stringify({ message: 'Use /sitemap.xml con Accept: application/xml.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const [brandEntries, vehicleEntries] = await Promise.all([buildBrandEntries(), buildVehicleEntries()])
  const xml = renderSitemap([...staticEntries, ...brandEntries, ...vehicleEntries])

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}

export const prerender = false
