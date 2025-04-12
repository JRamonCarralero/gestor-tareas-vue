import express from 'express';
import admin from '../firebase.admin.js';
import { db } from '../server.mongodb.js'; // Ajusta la ruta a tu conexión de MongoDB

const router = express.Router();

router.post('/', async (req, res) => {
  // recogemos el authorization header
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación.' });
  }

  // obtenemos el token
  const idToken = authorizationHeader.split(' ')[1];

  try {
    // Verificar el token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Buscar la información del usuario en tu base de datos (MongoDB) utilizando el UID de Firebase
    const user = await db.findOne({ firebaseUid: uid }, 'users');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
    }

    // Enviar la información del usuario al frontend
    res.json(user);

  } catch (error) {
    console.error('Error al verificar el token de Firebase:', error);
    return res.status(401).json({ message: 'Token de autenticación inválido.' });
  }
});

export default router;
