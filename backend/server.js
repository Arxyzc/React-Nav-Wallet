import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// middleware (software que se ejecuta antes de las rutas)
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

app.get("/api/transactions/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error al optener la transaccion", error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
})

app.post("/api/transactions", async (req, res) => {
    try {
        const {title, amount, category, user_id} = req.body;

        if(!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "Faltan datos requeridos" });
        }

        const transaccion = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        console.log(transaccion);
        res.status(201).json(transaccion[0]);

    } catch (error) {
        console.log("Error al crear la transaccion", error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
});

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "ID invalido"});
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaccion no encontrada"});
        }

        res.status(200).json({ message: "Transaccion eliminada correctamente"});
    } catch (error) {
        console.log("Error al borrar la transaccion", error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        `

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses,
        })

    } catch (error) {
        console.log("Error al obtener el resumen", error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
})

initiDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor corriendo en el puerto:", PORT);
    });
});