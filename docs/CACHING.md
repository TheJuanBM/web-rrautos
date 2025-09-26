# Caching Strategy

## Overview

This project now uses an Astro middleware (`src/middleware.ts`) to set cache-control headers on outgoing responses. The
goal is to align with Lighthouse’s “Efficient cache policy” guidance and reduce repeat-load bandwidth.

## Policies

- `/assets/**` hashed bundles, JSON, WASM, and source maps get `public, max-age=31536000, immutable`.
- Static media extensions (`avif`, `gif`, `ico`, `jpg`, `jpeg`, `png`, `svg`, `webp`) get
  `public, max-age=2592000, stale-while-revalidate=86400`.
- `manifest.json`, `robots.txt`, `sitemap.xml` receive `public, max-age=86400, stale-while-revalidate=86400`.
- All other routes fall back to `public, max-age=300, stale-while-revalidate=60`.

These defaults can be adjusted to match CDN or hosting constraints.
