import ratelimit from "../config/upstash.js";

const ratelimiter = async(req, res, next) => {
    try {
        // Limitar los solicitudes a 4 po minuto
        const { success } = await ratelimit.limit("my-rate-limit")

        if(!success) {
            return res.status(429).json({
                message: "Demasiadas solicitudes, por favor intente de nuevo mas tarde."
            })
        }

        next();
    } catch (error) {
        console.log("Error de limite de tarifa", error);
        next(error);
    }
};

export default ratelimiter;