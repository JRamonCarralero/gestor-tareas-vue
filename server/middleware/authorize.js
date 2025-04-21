import admin from '../firebase.admin.js';
import { db } from '../server.mongodb.js';

const authorize = (requiredRole) => {
    return async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token no proporcionado.' });
        }

        // Hago un split de la cabecera para obtener el token, quje es el segundo elemento
        const idToken = authorizationHeader.split('Bearer ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const firebaseUid = decodedToken.uid;

            const user = await db.findOne({ firebaseUid: firebaseUid }, 'users');

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // Ejemplo de verificación de roles
            if (requiredRole && user.role !== requiredRole) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a esta función.' });
            }

            // Adjuntar la información del usuario al objeto de la solicitud para que los controladores puedan acceder a ella
            req.user = user;
            next(); // Permitir que la solicitud continúe
        } catch (error) {
            console.error('Error al verificar el token:', error);
            return res.status(401).json({ message: 'Token inválido.' });
        }
    };
};

export default authorize;
