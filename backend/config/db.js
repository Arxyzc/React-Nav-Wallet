import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// Crear una conexion a la base de datos
export const sql = neon(process.env.DATABASE_URL);