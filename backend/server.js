import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("Esta funcionando");
});

console.log("Mi port:", process.env.PORT);

app.listen(PORT, () => {
    console.log("El servidor esta corriendo en el puerto es:", PORT);
});