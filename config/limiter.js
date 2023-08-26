// Importamos el módulo "express-rate-limit" para limitar las peticiones en Express
import rateLimit from "express-rate-limit";

/**
 * Crea un middleware para limitar peticiones genéricas.
 * @returns {Function} Middleware para limitar peticiones genéricas.
 */
export let limitGrt = () => {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo: 1 hora
        max: 5, // Máximo 5 peticiones en la ventana de tiempo
        standardHeaders: true,
        legacyHeaders: false,
        // Función para saltar la limitación en casos específicos
        skip: (req, res) => {
            if (parseInt(req.headers["content-length"]) > 690) {
                // Si la solicitud es demasiado grande, respondemos con un error y saltamos la limitación
                res.status(413).send({
                    status: 413,
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        },
        // Función para responder cuando se alcanza el límite de peticiones
        message: (req, res) => {
            res.status(429).send({
                status: 429,
                message: "Limite alcanzado"
            });
        }
    });
}

// ... Repetir el mismo patrón para las funciones limitLogin, limitUpdate y limitDelete ...

/**
 * Crea un middleware para limitar peticiones de actualización.
 * @returns {Function} Middleware para limitar peticiones de actualización.
 */
export let limitUpdate = () => {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo: 1 hora
        max: 10, // Máximo 10 peticiones en la ventana de tiempo
        standardHeaders: true,
        legacyHeaders: false,
        // Función para saltar la limitación en casos específicos
        skip: (req, res) => {
            if (parseInt(req.headers["content-length"]) > 370) {
                // Si la solicitud es demasiado grande, respondemos con un error y saltamos la limitación
                res.status(413).send({
                    status: 413,
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        },
        // Función para responder cuando se alcanza el límite de peticiones
        message: (req, res) => {
            res.status(429).send({
                status: 429,
                message: "Limite alcanzado"
            });
        }
    });
}

/**
 * Crea un middleware para limitar peticiones de eliminación.
 * @returns {Function} Middleware para limitar peticiones de eliminación.
 */
export let limitDelete = () => {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo: 1 hora
        max: 2, // Máximo 2 peticiones en la ventana de tiempo
        standardHeaders: true,
        legacyHeaders: false,
        // Función para saltar la limitación en casos específicos
        skip: (req, res) => {
            if (parseInt(req.headers["content-length"]) > 370) {
                // Si la solicitud es demasiado grande, respondemos con un error y saltamos la limitación
                res.status(413).send({
                    status: 413,
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        },
        // Función para responder cuando se alcanza el límite de peticiones
        message: (req, res) => {
            res.status(429).send({
                status: 429,
                message: "Limite alcanzado"
            });
        }
    });
}
