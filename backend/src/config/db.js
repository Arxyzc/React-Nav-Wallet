import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// Crear una conexion a la base de datos
export const sql = neon(process.env.DATABASE_URL);

export async function initiDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Base de datos inicializada correctamente");
    } catch (error) {
        console.log("Error al inicializar la base de datos:", error);
        process.exit(1);
    }
}