# 🤝 Guía de Contribución - RR Autos

¡Gracias por tu interés en contribuir al proyecto RR Autos! Esta guía te ayudará a participar de manera efectiva.

## 📋 Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía hacia otros colaboradores

## 🚀 Cómo Contribuir

### 1. Fork y Clonar

```bash
# Fork el repositorio en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/rr.git
cd rr

# Añade el repositorio original como upstream
git remote add upstream https://github.com/original/rr.git
```

### 2. Configurar el Entorno

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

### 3. Crear una Rama

```bash
# Siempre crea una nueva rama para tu trabajo
git checkout -b feature/nombre-descriptivo
```

## 🏗️ Arquitectura del Proyecto

### Principios de Diseño

- **Separación de responsabilidades**: Cada componente tiene un propósito específico
- **Reutilización**: Componentes modulares y configurables
- **Accesibilidad**: Cumplimiento WCAG AA como mínimo
- **Performance**: Optimización en cada decisión

### Estructura de Carpetas

```
src/
├── components/    # Componentes UI reutilizables
├── layouts/       # Layouts de página
├── pages/         # Páginas del sitio
├── scripts/       # Scripts del cliente
├── services/      # Servicios API
├── styles/        # Estilos globales
├── types/         # Definiciones TypeScript
├── utils/         # Funciones auxiliares
└── config/        # Configuración
```

## ✅ Estándares de Código

### TypeScript

- Usa tipos explícitos cuando sea posible
- Evita `any`, usa `unknown` si es necesario
- Documenta interfaces complejas

```typescript
// ✅ Bueno
interface VehiculoProps {
  id: string
  title: string
  precio?: number
}

// ❌ Evitar
const data: any = fetchData()
```

### Astro Components

- Un componente por archivo
- Props tipadas con TypeScript
- Estilos scoped cuando sea apropiado

```astro
---
interface Props {
  title: string
  isActive?: boolean
}

const { title, isActive = false } = Astro.props
---

<button class:list={['btn', { active: isActive }]}>
  {title}
</button>
```

### CSS/Tailwind

- Usa clases de utilidad de Tailwind
- Crea componentes CSS solo para patrones repetitivos
- Mantén la especificidad baja

```css
/* ✅ Bueno - Componente reutilizable */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}

/* ❌ Evitar - Demasiado específico */
.page .header .nav .item .link {
  color: blue;
}
```

## 📝 Convenciones de Commit

Usa el formato [Conventional Commits](https://conventionalcommits.org/):

```
tipo(scope): descripción

feat(components): añadir componente de búsqueda
fix(api): corregir manejo de errores en fetchVehiculos
docs(readme): actualizar instrucciones de instalación
style(css): mejorar contraste de botones
refactor(utils): simplificar función de paginación
test(components): añadir tests para BrandSelector
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar lógica)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

## 🧪 Testing

### Antes de Enviar

```bash
# Verificar linting
pnpm lint

# Construir para producción
pnpm build

# Vista previa del build
pnpm preview
```

### Checklist de Calidad

- [ ] El código sigue las convenciones del proyecto
- [ ] Funciona en móvil y desktop
- [ ] Es accesible (navegación por teclado, screen readers)
- [ ] No introduce warnings de ESLint
- [ ] Mantiene o mejora el rendimiento
- [ ] Está documentado (si es una nueva funcionalidad)

## 🎯 Tipos de Contribuciones

### 🐛 Reportar Bugs

Cuando reportes un bug, incluye:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Información del navegador/dispositivo

### 💡 Sugerir Features

Para nuevas funcionalidades:

- Explica el problema que resuelve
- Describe la solución propuesta
- Considera alternativas
- Piensa en el impacto en la accesibilidad y performance

### 📚 Mejorar Documentación

- Corregir errores tipográficos
- Clarificar instrucciones
- Añadir ejemplos
- Traducir contenido

## 🔄 Proceso de Review

### Pull Request

1. **Título descriptivo**: Sigue convenciones de commit
2. **Descripción detallada**: Explica qué, por qué y cómo
3. **Screenshots**: Si hay cambios visuales
4. **Checklist**: Marca todos los items aplicables

```markdown
## 📋 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Cambio breaking
- [ ] Documentación

## ✅ Checklist

- [ ] Mi código sigue las convenciones del proyecto
- [ ] He probado en diferentes navegadores
- [ ] Es accesible (WCAG AA)
- [ ] He actualizado la documentación (si necesario)
```

### Criterios de Aprobación

- Funcionalidad correcta
- Código limpio y bien estructurado
- Cumple estándares de accesibilidad
- Mantiene o mejora performance
- Documentación actualizada

## 🏷️ Áreas de Contribución

### Prioridades Altas

- Mejoras de accesibilidad
- Optimizaciones de performance
- Corrección de bugs críticos
- Mejoras de UX

### Oportunidades

- Nuevos componentes reutilizables
- Integración con APIs adicionales
- Mejoras de SEO
- Tests automatizados

## 💬 Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas y ideas
- **Email**: Para temas sensibles

## 🎉 Reconocimiento

Todos los contribuidores serán reconocidos en:

- Lista de contribuidores en README
- Release notes
- Documentación del proyecto

¡Gracias por hacer que RR Autos sea mejor para todos! 🚗✨
