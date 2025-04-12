// src/routes/auth.js
import express from 'express';
import verifyTokenRoute from './verifyToken.js'; // Importa la ruta de verificación

const router = express.Router();

// definimos la ruta para verificar el token
router.use('/verify-token', verifyTokenRoute);

export default router;
