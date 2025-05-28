import express from "express";
import dotenv from "dotenv";
import { initiDB } from "./config/db.js";
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



app.use("/api/transactions", transactionsRoute);

initiDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor corriendo en el puerto:", PORT);
    });
});