# 🚗 RR Autos - Catálogo de Vehículos

Aplicación web construida con **Astro** para mostrar el catálogo de vehículos usados de RR Autos con foco en
accesibilidad, rendimiento y SEO.

## ✨ Características

- 🏎️ **Catálogo dinámico** de vehículos con filtrado por marca
- 📱 **Diseño responsive** y mobile-first
- ♿ **Accesibilidad completa** (WCAG AA/AAA) y navegación por teclado
- 🔍 **SEO centralizado** con metadatos por defecto y Schema.org/Open Graph
- 🎨 **UI moderna** con Tailwind CSS y componentes reutilizables
- ⚙️ **Utilidades de cliente** para sanitizar datos, optimizar imágenes y generar paginaciones

> Nota: el proyecto incluye un `sw.js` opcional, pero el registro del Service Worker está desactivado por defecto para
> priorizar una experiencia sin sorpresas. Puedes activarlo manualmente si necesitas funcionalidad offline.

## 🛠️ Tecnologías

- **[Astro](https://astro.build/)** - Framework web moderno
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **Astro View Transitions** deshabilitadas (apuesta por SSR limpio)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd rr

# Instalar dependencias
npm | pnpm install

# Iniciar el servidor de desarrollo
npm | pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

## 📋 Comandos Disponibles

| Comando           | Descripción                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Inicia el servidor de desarrollo   |
| `pnpm build`      | Genera el build estándar           |
| `pnpm build:prod` | Build optimizado (sin pasos extra) |
| `pnpm test:ci`    | Ejecuta Vitest con cobertura       |

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── AsesoresList.astro            # Listado de asesores
│   ├── BrandSelector.astro           # Selector de marcas
│   ├── OptimizedImage.astro          # Utilidad opcional para imágenes
│   ├── SEOHead.astro                 # Meta tags y SEO
│   ├── VehicleSkeleton.astro         # Loading skeleton reutilizable
│   └── vehiculos/                    # Componentes específicos del catálogo
│       ├── CatalogCTA.astro          # CTA del catálogo
│       ├── CatalogShell.astro        # Contenedor principal del catálogo
│       ├── FiltersCard.astro         # Card de filtros
│       ├── HighlightsSection.astro   # Beneficios destacados
│       ├── ResultsSection.astro      # Contenedor de resultados y paginación
│       ├── VehicleHero.astro         # Cabecera del detalle con galería
│       ├── VehicleHighlights.astro   # Lista de especificaciones clave
│       └── VehicleSummary.astro      # Resumen y beneficios del vehículo
├── layouts/             # Layouts de página
│   └── Layout.astro           # Layout principal
├── pages/               # Páginas del sitio
│   ├── index.astro            # Página de inicio
│   └── vehiculos/
│       ├── index.astro        # Página principal del catálogo
│       └── [slug].astro       # Página de detalle por vehículo
├── scripts/             # Scripts del cliente
│   └── vehiculosClient.ts       # Lógica de filtrado y paginación
├── services/            # Servicios API
│   └── api.ts                 # Cliente API
├── styles/              # Estilos globales
│   ├── global.css             # Estilos base
│   └── components.css         # Componentes CSS
├── types/               # Definiciones TypeScript
│   └── index.ts               # Tipos principales
├── utils/               # Utilidades
│   └── index.ts               # Funciones helpers
└── config/              # Configuración
    └── constants.ts           # Constantes del proyecto
```

## 🎯 Funcionalidades Principales

### Catálogo de Vehículos

- Filtrado por marca en tiempo real
- Paginación con navegación por teclado
- Cards responsive con información detallada
- Imágenes optimizadas con lazy loading

### Accesibilidad ♿

- Navegación completa por teclado
- Soporte para screen readers (ARIA)
- Contraste optimizado (WCAG AA/AAA)
- Focus management avanzado

### Performance 🚀

- Imágenes responsive generadas dinámicamente
- Critical CSS inline desde el layout base
- Llamadas fetch encapsuladas con manejo de errores
- Paginación y skeletons con rendering diferido

### SEO 🔍

- Metadatos por defecto gestionados desde `Layout.astro`
- Schema.org structured data para `AutoDealer`
- Open Graph y Twitter Cards listos para compartir
- Sitemap, robots y manifest listos para producción

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` (opcional):

```env
# URL base de la API (si difiere del default)
API_BASE_URL=https://api.rrautos.com
```

### Personalización

- **Colores**: actualiza `src/styles/global.css`
- **Configuración API**: edita `src/config/constants.ts`
- **Metadatos SEO**: ajusta `src/components/SEOHead.astro` o pasa props al layout

## 📱 Assets instalables

- Manifest y favicon listos para agregar la aplicación a pantalla de inicio
- Service Worker opcional (`public/sw.js`) pendiente de registro manual si se desea funcionalidad offline
- Íconos optimizados para diferentes dispositivos

## 🚢 Despliegue

### Build para Producción

```bash
# Build básico
npm | pnpm build

# Build optimizado
npm | pnpm build:prod
```

### Servidor Web

Se incluye configuración de ejemplo para nginx en `nginx.conf.example`.

Características incluidas:

- Compresión gzip/brotli
- Headers de seguridad
- Cache control optimizado
- Soporte para PWA

## 📊 Optimizaciones Implementadas

- **Accesibilidad**: componentes con `aria` labels, foco gestionado y mensajes para screen readers
- **SEO**: títulos unificados con sufijo automático, JSON-LD, canonical dinámico
- **Performance**: skeletons en cliente, prefetch/preconnect selectivo y utilidades de imágenes
- Improvements
  - Added middleware (`src/middleware.ts`) to set caching headers for static assets, media, and HTML responses,
    addressing Lighthouse’s “Efficient cache policy” recommendation.

## 📚 Documentación Adicional

- **[Guía de Refactorización](./REFACTORING_GUIDE.md)** - Arquitectura y patrones
- **[Mejoras de Contraste](./CONTRAST_IMPROVEMENTS.md)** - Accesibilidad visual
- **[SEO y Performance](./SEO_ACCESSIBILITY_PERFORMANCE_GUIDE.md)** - Optimizaciones

## 🛡️ Buenas Prácticas Implementadas

- **Clean Code** y responsabilidades compartimentadas
- **TypeScript** para tipado estático
- **Componentes y utilidades reutilizables** documentadas en `src/utils`
- **Performance first** con fallback seguro ante errores
- **Accessibility by design** en cada vista

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

RR Autos - Especialistas en vehículos usados de calidad

---

_Construido con ❤️ usando Astro y las mejores prácticas de desarrollo web moderno._
