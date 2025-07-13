# Pokeclipse

## Dev env

Add a `.env` file from one of the examples in `apps/api`.

Run the docker compose file `docker compose up -d` if you don't have a postgres instance ready.

Connect to Pgadmin if you need to check the contents of the database `http://localhost:8888/` and connect to the database server using :
```
host: host.docker.internal
database: <from .env>
user: <from .env>
password: <from .env>
```

`npm i -g turbo`.

`cd apps/api` and `npx prisma generate` and `npx prisma db push` or `npx prisma migrate dev --name init`.

`npm run dev` in root directory.
