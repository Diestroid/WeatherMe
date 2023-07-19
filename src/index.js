//Express
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Vistas
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname =  dirname(fileURLToPath(import.meta.url));
app.use("/public", express.static(join(__dirname, "/public")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

//lógica
app.use("/js", express.static(join(__dirname, "/views/logic")));

//Rutas
import indexRoutes from "./routes/index.js"
app.use(indexRoutes);

//Ini Server
app.listen(3000);
console.log("server running in http://localhost:3000");

