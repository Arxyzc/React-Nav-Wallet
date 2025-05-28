import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

// middleware (software que se ejecuta antes de las rutas)
app.use(ratelimiter);
app.use(express.json());

// app.use((req, res, next) => {
//     console.log("Hola llegamos a un requerimiento", req.method)
//     next();
// })

const PORT = process.env.PORT || 5001;

async function initiDB() {
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

app.get("/", (req, res) => {
    res.send("Esta funcionado")
})

app.use("/api/transactions", transactionsRoute);

initiDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor corriendo en el puerto:", PORT);
    });
});