# 🚀 Frontend - Sistema de Gestión de Usuarios y Productos

## 📋 Descripción
Aplicación web desarrollada con Angular 16 y Material Design para la gestión de usuarios y productos, con un diseño moderno, responsivo y una experiencia de usuario intuitiva.

## ⭐ Características
- 🎨 Interfaz moderna con Angular Material
- 📱 Diseño 100% responsive
- 🔒 Sistema de autenticación JWT
- 🛡️ Rutas protegidas
- 🔄 Estado global de la aplicación
- 📊 Dashboard interactivo
- 🌙 Modo oscuro/claro
- 🌐 Soporte multiidioma

## 🛠️ Tecnologías Principales
- ⚡ Angular 16
- 🎨 Angular Material
- 📊 Chart.js para gráficos
- 🔄 RxJS
- 🎭 NGX-Translate
- 📱 Flex Layout
- 🧪 Jasmine & Karma

## 📦 Dependencias Principales
```json
{
  "@angular/material": "^16.x.x",
  "@angular/flex-layout": "^16.x.x",
  "@ngx-translate/core": "^15.x.x",
  "chart.js": "^4.x.x",
  "jwt-decode": "^3.x.x",
  "moment": "^2.x.x"
}
```

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Instalar Angular Material**
```bash
ng add @angular/material
```

4. **Ejecutar aplicación**
```bash
ng serve
```

## 🎯 Módulos Principales

### 🔐 Módulo de Autenticación
- Login
- Registro
- Recuperación de contraseña
- Guards de autenticación
- Interceptor JWT

### 📦 Módulo de Productos
- Lista de productos
- CRUD completo
- Filtros avanzados
- Gestión de stock
- Reportes

### 👥 Módulo de Usuarios
- Gestión de usuarios
- Roles y permisos
- Perfil de usuario
- Configuraciones

## 💅 Estilos y Temas

### 🎨 Personalización de Material
```scss
@use '@angular/material' as mat;

$my-primary: mat.define-palette(mat.$indigo-palette, 500);
$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));
```

## 🔒 Seguridad
- ✅ Interceptor JWT
- 🛡️ Guards en rutas protegidas
- 🔐 Almacenamiento seguro de tokens
- 🚫 Protección XSS
- 🔄 Refresh tokens

## 📱 Responsive Design
- 📱 Mobile First
- 💻 Desktop
- 🖥️ Large Screens
- 📊 Responsive Tables
- 🗺️ Responsive Charts


## 📚 Comandos Útiles
```bash
# Crear nuevo componente
ng g c components/nuevo-componente

# Crear nuevo servicio
ng g s services/nuevo-servicio

# Crear nuevo módulo
ng g m modules/nuevo-modulo

# Build producción
ng build --prod
```

## 🌟 Mejores Prácticas
- ✨ Lazy Loading en módulos
- 📏 Código limpio y documentado
- 🔄 Gestión de estado centralizada
- 🎯 Componentes reutilizables
- 📝 TypeScript strict mode

## 🐛 Debugging
- Chrome DevTools
- Angular DevTools
- Source Maps habilitados
- Logging service personalizado

## 🔄 CI/CD
- 📦 GitHub Actions
- 🚀 Despliegue automático
- 🧪 Tests automáticos
- 📊 Reportes de cobertura

## 📈 Optimización
- ⚡ Lazy Loading
- 🖼️ Optimización de imágenes
- 🗜️ Compresión de assets
- 🚀 Bundle optimization



## 📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

