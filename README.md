# ✂ CLIPR

Sistema de gestión de reservaciones para barberías. Permite administrar citas, clientes, barberos y servicios desde un dashboard centralizado, con una página pública para que los clientes agenden sin registrarse.

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Docker)
- **Tailwind CSS**
- **Recharts** (reportes)
- **JWT** (sesiones con `jose`)
- **bcryptjs** (hash de contraseñas)

---

## Funcionalidades

### Dashboard (recepcionista)
- Resumen del día: citas, ingresos, pendientes y clientes nuevos
- Calendario interactivo con vistas **diaria**, **semanal** y **mensual**
- Confirmación y cancelación de citas desde el calendario
- CRUD de **clientes**, **barberos** y **servicios**
- Reportes visuales: ingresos por mes, citas por estado, rendimiento por barbero, servicios más solicitados y clientes frecuentes

### Página pública `/schedule`
- Formulario de reserva sin registro
- Selección de barbero, servicio, fecha y hora
- Validación de disponibilidad (sin doble reserva)
- Crea el cliente automáticamente si no existe

### Autenticación
- Login y registro con validación
- Sesiones persistentes con JWT en cookies (7 días)
- Rutas protegidas redirigen al login si no hay sesión

---

## Instalación

### Requisitos
- Node.js 18+
- Docker

### 1. Clona el repositorio

```bash
git clone https://github.com/gioMarquez/clipr.git
cd clipr
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# Base de datos
DATABASE_URL="postgresql://clipr_user:clipr_pass@localhost:5432/clipr_db?schema=public"

# Clave secreta para JWT (mínimo 32 caracteres)
SESSION_SECRET="tu-clave-secreta-aqui"
```

### 4. Levanta la base de datos

```bash
docker compose up -d
```

### 5. Ejecuta las migraciones

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Inicia el servidor

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.

---

## Estructura del proyecto

```
clipr/
├── app/
│   ├── dashboard/          # Rutas protegidas del panel
│   │   ├── calendar/       # Calendario de citas
│   │   ├── clients/        # CRUD de clientes
│   │   ├── barbers/        # CRUD de barberos
│   │   ├── catalog/        # CRUD de servicios
│   │   ├── reports/        # Reportes y gráficas
│   │   └── perfil/         # Perfil del usuario
│   ├── schedule/           # Página pública de reservas
│   ├── login/              # Autenticación
│   ├── register/           # Registro
│   └── components/         # Componentes reutilizables
├── lib/
│   ├── prisma.ts           # Cliente de Prisma
│   └── session.ts          # Manejo de sesiones JWT
├── prisma/
│   ├── schema.prisma       # Modelos de la BD
│   └── migrations/         # Historial de migraciones
└── docker-compose.yml      # Configuración de PostgreSQL
```

---

## Modelos principales

| Modelo        | Descripción                              |
|---------------|------------------------------------------|
| `User`        | Usuarios del sistema (recepcionistas)    |
| `Barber`      | Barberos registrados                     |
| `Client`      | Clientes de la barbería                  |
| `Service`     | Servicios con precio y duración          |
| `Appointment` | Citas con estado, fecha, barbero y cliente |

---

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Linter

npx prisma studio    # Explorador visual de la BD
npx prisma migrate dev --name <nombre>  # Nueva migración
```

---
