## Requirements

- [Node.js (22.18.0+)](https://nodejs.org/)
- [Docker](https://docs.docker.com/engine/) _(required only if you plan to run the database locally)_

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required environment variables.

---

## Running The Database

> [!NOTE]
> If you already have a PostgreSQL database configured, you can skip this step.

```bash
docker compose up -d
```

## Starting The App

> [!NOTE]
> Make sure you are connected to a VPN or a secure network before proceeding.

### Install Dependencies

```bash
pnpm install
```

### Build the Application

```bash
pnpm run build
```

### Apply Database Migrations

```bash
pnpm exec prisma migrate dev
```

### Running the Project

Start in development mode:

```bash
pnpm run start:dev
```

---

### Open in Browser

- Swagger API: [http://localhost:YOUR_API_PORT/swagger](http://localhost:YOUR_API_PORT/swagger)
