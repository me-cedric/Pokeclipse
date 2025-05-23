import "dotenv/config";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "../../generated/prisma";

const client = new PGlite(process.env.DATABASE_DIR);
const adapter = new PrismaPGlite(client);
const prisma = new PrismaClient({ adapter });

export default prisma;
