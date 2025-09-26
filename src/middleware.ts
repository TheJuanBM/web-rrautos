import type { MiddlewareHandler } from 'astro'

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const MEDIA_CACHE_CONTROL = 'public, max-age=2592000, stale-while-revalidate=86400'
const DEFAULT_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=60'

const immutableAssetPattern = /^\/assets\/(.+)\.(?:css|js|mjs|cjs|wasm|json|map)$/i
const mediaExtensionPattern = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next()
  if (!response) return response

  const { request } = context
  const { pathname } = new URL(request.url)

  // Avoid overriding cache policy if it was set upstream (e.g., API routes customizing headers)
  if (response.headers.has('Cache-Control')) {
    return response
  }

  if (immutableAssetPattern.test(pathname)) {
    response.headers.set('Cache-Control', IMMUTABLE_CACHE_CONTROL)
    return response
  }

  if (mediaExtensionPattern.test(pathname)) {
    response.headers.set('Cache-Control', MEDIA_CACHE_CONTROL)
    return response
  }

  if (pathname === '/manifest.json' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400')
    return response
  }

  response.headers.set('Cache-Control', DEFAULT_CACHE_CONTROL)
  return response
}

