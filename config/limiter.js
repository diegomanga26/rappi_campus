import rateLimit from "express-rate-limit";

// Función para limitar peticiones genéricas
export let limitGrt = () => {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo: 1 hora
        max: 5, // Máximo 5 peticiones en la ventana de tiempo
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req, res) => {
            if (parseInt(req.headers["content-length"]) > 690) {
                res.status(413).send({
                    status: 413,
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        },
        message: (req, res) => {
            res.status(429).send({
                status: 429,
                message: "Limite alcanzado"
            });
        }
    });
}

// Función para limitar peticiones de inicio de sesión
export let limitLogin = () => {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo: 1 hora
        max: 3, // Máximo 3 peticiones en la ventana de tiempo
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req, res) => {
            if (parseInt(req.headers["content-length"]) > 370) {
                res.status(413).send({
                    status: 413,
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        },
        message: (req, res) => {
            res.status(429).send({
                status: 429,
                message: "Limite alcanzado"
            });
        }
    });
}
