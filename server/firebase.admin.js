// Conectamos con firebase para poder usar las funciones de firebase con el servidor

import admin from 'firebase-admin';
import serviceAccount from '../hidden/proyect-tool-firebase-adminsdk-fbsvc-94fe4e2960.json' with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
