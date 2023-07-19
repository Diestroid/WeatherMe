import { Router } from "express";
import bcryptjs from "bcryptjs";
import connection from "../database.js";
import session from "express-session";

const router = Router();

router.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

function autenticacionRequerida(req, res, next) {
    if (req.session.usuario) {
      next();
    } else {
      res.render("logIn");
    }
}

function nonAutentication(req, res, next){
    if (!req.session.usuario) {
        next();
      } else {
        const usuario = req.session.usuario;
        res.render("home", {usuario});
      }
}

router.get("/", (req, res) => {
    const usuario = req.session.usuario;
    res.render("home", { usuario });
});

router.get("/contact", (req, res) => {
    const usuario = req.session.usuario;
    res.render("contact",{usuario})
});

router.get("/logIn", nonAutentication, (req, res) => {
    res.render("logIn"); 
});

router.post("/logIn", async (req, res) => {
    const { usuario, contraseña } = req.body;
    if ( !usuario || !contraseña ) {
        res.render("signUp", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, llene todos los campos.",
            alertIcon: "error",
            showConfirmButton: false,
            ruta:""
        })
        return;
    }
    if (usuario.trim().length === 0 || contraseña.trim().length === 0) {
        res.render("signUp", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, ingrese valores válidos en todos los campos.",
            alertIcon: "error",
            showConfirmButton: false,
            ruta:""
        })
        return;
    }
    try {
        //Verificar si el usuario ya existe en la base de datos
        const userExistsQuery = "SELECT * FROM users WHERE user = ?";
        connection.query(userExistsQuery, [usuario], async (error, results) => {
          if (results.length > 0 || await bcryptjs.compare(contraseña, results[0].contraseña)) {
            req.session.usuario = usuario;
            res.render("logIn", {
                alert: true,
                alertTitle: "Sesión iniciada!",
                alertMessage: "El usuario ha sido loggeado con exito!.",
                alertIcon: "sucess",
                showConfirmButton: false,
                ruta:"/"
            })
          }else{
            res.render("logIn", {
                alert: true,
                alertTitle: "Error!",
                alertMessage: "Datos incorrectos.",
                alertIcon: "error",
                showConfirmButton: false,
                ruta:""
            })
            return;
          }
            // Encriptar la contraseña
            bcryptjs.hash(contraseña, 10, (error, hashedPassword) => {
                if (error) {
                    console.error("Error al encriptar la contraseña:", error);
                    return res.status(500).send("Error al encriptar la contraseña");
                }
                });
            });
    }catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro");
      }
    });

router.get("/signUp", nonAutentication, (req, res) => res.render("signUp"));
router.post("/signUp", async (req, res) => {

    const { email, usuario, contraseña, confirmarContraseña } = req.body;

    //Validar si las contraseñas son iguales
    if (contraseña !== confirmarContraseña) {
        res.render("signUp", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Las contraseñas no son iguales.",
            alertIcon: "error",
            showConfirmButton: false,
            ruta:""
        })
        return;
    } 

    //Validar que no haya valores nulos
    if (!email || !usuario || !contraseña || !confirmarContraseña) {
        res.render("signUp", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, llene todos los campos.",
            alertIcon: "error",
            showConfirmButton: false,
            ruta:""
        })
        return;
    }

    //Validar que no haya valores vacíos
    if (email.trim().length === 0 || usuario.trim().length === 0 || contraseña.trim().length === 0 || confirmarContraseña.trim().length === 0) {
        res.render("signUp", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, ingrese valores válidos en todos los campos.",
            alertIcon: "error",
            showConfirmButton: false,
            ruta:""
        })
        return;
    }

    try {
        //Verificar si el usuario ya existe en la base de datos
        const userExistsQuery = "SELECT * FROM users WHERE user = ?";
        connection.query(userExistsQuery, [usuario], (error, results) => {
          if (error) {
            console.error("Error al verificar si el usuario existe en la base de datos:", error);
            return res.status(500).send("Error al verificar el usuario en la base de datos");
          }
    
          if (results.length > 0) {
            res.render("signUp", {
                alert: true,
                alertTitle: "Error!",
                alertMessage: "El usuario ya existe.",
                alertIcon: "error",
                showConfirmButton: false,
                ruta:""
            })
            return;
          }
    
            bcryptjs.hash(contraseña, 10, (error, hashedPassword) => {
                if (error) {
                    console.error("Error al encriptar la contraseña:", error);
                    return res.status(500).send("Error al encriptar la contraseña");
                }
    
                // Insertar los datos en la base de datos
                const insertQuery = "INSERT INTO users (email, user, password) VALUES (?, ?, ?)";
                connection.query(insertQuery, [email, usuario, hashedPassword], (error, result) => {
                if (error) {
                    console.error("Error al guardar los datos en la base de datos:", error);
                    return res.status(500).send("Error al guardar los datos en la base de datos");
                }
                res.render("signUp", {
                    alert: true,
                    alertTitle: "Usuario Registrado!",
                    alertMessage: "El usuario ha sido registrado con exito!.",
                    alertIcon: "sucess",
                    showConfirmButton: false,
                    ruta:"/"
                })
                return;
                });
            });
        });
    }catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro");
      }
    });

router.get("/forum", autenticacionRequerida, (req, res) => {
    const usuario = req.session.usuario;
    res.render("forum", {usuario})
});

router.get("/logout", autenticacionRequerida, (req, res) => {
    req.session.destroy();
    res.render("logIn");
  });

export default router;
