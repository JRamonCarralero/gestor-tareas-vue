import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import { db } from "./server.mongodb.js";
import { ObjectId } from "mongodb";
import process from "node:process";
import admin from './firebase.admin.js';

const app = express();
const port = process.env.PORT;

// Add port 5173 to CORS headers
app.use(cors());

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


// USERS //

app.post('/create/users', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren email y contraseña.' });
  }
  try {
    // Creamos el usuario en Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log('Usuario creado en Firebase:', userRecord.uid);

    // Guardamos el usuario en MongoDB
    const userData = {
      firebaseUid: userRecord.uid,
      email: email,
      name: name,
      role: role
    };
    res.status(201).json(await db.create(userData, 'users'));

  } catch (error) {
    console.error('Error al crear el usuario en Firebase:', error);
    let errorMessage = 'Error al crear el usuario en Firebase.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'El correo electrónico ya está en uso en Firebase.';
    }
    res.status(500).json({ message: errorMessage, firebaseErrorCode: error.code });
  }
})

app.get('/read/users', async (req, res) => {
  res.json(await db.get({}, 'users'))
})

app.put('/update/users/:id', async (req, res) => {
  res.json(await db.update(req.params.id, req.body, 'users'))
})

app.delete('/delete/users/:id', async (req, res) => {
  res.json(await db.delete(req.params.id, 'users'))
})

app.delete('/delete/users/uid/:uid', async (req, res) => {
  const uidToDelete = req.params.uid;

  if (!uidToDelete) {
    return res.status(400).json({ message: 'Se requiere el UID del usuario a eliminar.' });
  }

  try {
    // Eliminamos el usuario de Firebase
    await admin.auth().deleteUser(uidToDelete);
    console.log(`Usuario con UID ${uidToDelete} eliminado de Firebase.`);

    // Eliminamos al usuario de MongoDB
    res.json(await db.deleteUserByUID(uidToDelete));

  } catch (error) {
    console.error(`Error al eliminar el usuario con UID ${uidToDelete} de Firebase:`, error);
    let errorMessage = `Error al eliminar el usuario con UID ${uidToDelete} de Firebase.`;
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No se encontró ningún usuario con el UID proporcionado en Firebase.';
    }
    res.status(500).json({ message: errorMessage, firebaseErrorCode: error.code });
  }
})

app.get('/findbyid/users/:id', async (req, res) => {
  res.json(await db.findById({ _id: new ObjectId(req.params.id) }, 'users'))
})



app.listen(port, () => {
  console.log(`Project Tool listening on port ${port}`)
})
