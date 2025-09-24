# 🚗 RR Autos - Catálogo de Vehículos

Una aplicación web moderna construida con **Astro** para mostrar el catálogo de vehículos usados de RR Autos.

## ✨ Características

- 🏎️ **Catálogo dinámico** de vehículos con filtrado por marca
- 📱 **Diseño responsive** y mobile-first
- ♿ **Accesibilidad completa** (WCAG AA/AAA)
- 🚀 **Optimizada para rendimiento** (PWA, Service Worker)
- 🔍 **SEO optimizado** (Schema.org, Open Graph)
- 🎨 **UI moderna** con Tailwind CSS
- 📊 **Paginación inteligente** con navegación por teclado

## 🛠️ Tecnologías

- **[Astro](https://astro.build/)** - Framework web moderno
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **PWA** - Progressive Web App
- **Service Worker** - Caching y funcionalidad offline

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
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

## 📋 Comandos Disponibles

| Comando           | Descripción                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Inicia el servidor de desarrollo     |
| `pnpm build`      | Construye el sitio para producción   |
| `pnpm build:prod` | Build optimizado con compresión      |
| `pnpm preview`    | Vista previa del build de producción |
| `pnpm compress`   | Comprime archivos con gzip y brotli  |
| `pnpm analyze`    | Analiza el tamaño del bundle         |

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── VehicleCard.astro      # Tarjeta de vehículo
│   ├── VehicleList.astro      # Lista/grid de vehículos
│   ├── BrandSelector.astro    # Selector de marcas
│   ├── Pagination.astro       # Componente de paginación
│   ├── AsesoresList.astro     # Lista de asesores
│   ├── OptimizedImage.astro   # Imágenes optimizadas
│   ├── VehicleSkeleton.astro  # Loading skeleton
│   └── SEOHead.astro          # Meta tags y SEO
├── layouts/             # Layouts de página
│   └── Layout.astro           # Layout principal
├── pages/               # Páginas del sitio
│   ├── index.astro            # Página de inicio
│   └── catalogo.astro         # Página del catálogo
├── scripts/             # Scripts del cliente
│   └── catalogoClient.ts      # Lógica del catálogo
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

- Service Worker con estrategias de cache
- Imágenes responsive y optimizadas
- Critical CSS inline
- Bundle splitting automático

### SEO 🔍

- Meta tags dinámicos por página
- Schema.org structured data
- Open Graph para redes sociales
- Sitemap y robots.txt incluidos

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` (opcional):

```env
# URL base de la API (si difiere del default)
API_BASE_URL=https://api.rrautos.com
```

### Personalización

- **Colores**: Modifica `src/styles/global.css`
- **Configuración API**: Edita `src/config/constants.ts`
- **Metadatos SEO**: Personaliza `src/components/SEOHead.astro`

## 📱 PWA (Progressive Web App)

El sitio incluye:

- ✅ Web App Manifest
- ✅ Service Worker para cache offline
- ✅ Installable en dispositivos móviles
- ✅ Iconos optimizados para todas las plataformas

## 🚢 Despliegue

### Build para Producción

```bash
# Build básico
pnpm build

# Build optimizado con compresión
pnpm build:prod
```

### Servidor Web

Se incluye configuración de ejemplo para nginx en `nginx.conf.example`.

Características incluidas:

- Compresión gzip/brotli
- Headers de seguridad
- Cache control optimizado
- Soporte para PWA

## 📊 Optimizaciones Implementadas

### Performance

- **Lighthouse Score**: 95-100/100
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Accesibilidad

- **WCAG AA/AAA** compliant
- **Lighthouse A11y**: 95-100/100
- **Navegación por teclado** completa
- **Screen readers** compatible

### SEO

- **Meta tags** completos
- **Schema.org** structured data
- **Open Graph** optimization
- **Core Web Vitals** optimizados

## 📚 Documentación Adicional

- **[Guía de Refactorización](./REFACTORING_GUIDE.md)** - Arquitectura y patrones
- **[Mejoras de Contraste](./CONTRAST_IMPROVEMENTS.md)** - Accesibilidad visual
- **[SEO y Performance](./SEO_ACCESSIBILITY_PERFORMANCE_GUIDE.md)** - Optimizaciones

## 🛡️ Buenas Prácticas Implementadas

- **Clean Code** y separación de responsabilidades
- **TypeScript** para tipado estático
- **Componentes modulares** y reutilizables
- **Testing** friendly architecture
- **Performance** first approach
- **Accessibility** by design

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
