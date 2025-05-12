import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import { db } from "./server.mongodb.js";
import { ObjectId } from "mongodb";
import process from "node:process";
import admin from './firebase.admin.js';
import authRoutes from './routes/auth.js'; //importamos la ruta para verificar el token
import authorize from './middleware/authorize.js';

const app = express();
const port = process.env.PORT;

// Add port 5173 to CORS headers
app.use(cors());

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// AUTH //
app.use('/api/auth', authRoutes);


// USERS //

app.post('/create/users', authorize('admin'), async (req, res) => {
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
    const response = await db.create(userData, 'users')
    res.status(201).json({ message: 'OK', data: response });

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

app.put('/update/users/:id', authorize('admin'), async (req, res) => {
  try {
    const response = await db.update(req.params.id, req.body, 'users')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
})

app.delete('/delete/users/:id', async (req, res) => {
  res.json(await db.delete(req.params.id, 'users'))
})

app.delete('/delete/users/uid/:uid', authorize('admin'),  async (req, res) => {
  const uidToDelete = req.params.uid;

  if (!uidToDelete) {
    return res.status(400).json({ message: 'Se requiere el UID del usuario a eliminar.' });
  }

  try {
    // Eliminamos el usuario de Firebase
    await admin.auth().deleteUser(uidToDelete);
    console.log(`Usuario con UID ${uidToDelete} eliminado de Firebase.`);

    // Eliminamos al usuario de MongoDB
    const response = await db.deleteUserByUID(uidToDelete)
    res.status(200).json({ message: 'OK', data: response });

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

// Projects //

app.post('/create/projects',authorize('admin'), async (req, res) => {
  try {
    const data =  req.body
    data.createdBy = new ObjectId(data.createdBy)
    data.assignedTo = data.assignedTo.map(id => new ObjectId(id))
    const response = await db.create(data, 'projects')
    res.status(201).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ message: 'Error al crear el proyecto.' });
  }
})

app.get('/read/projects', async (req, res) => {
  res.json(await db.get({}, 'projects'))
})

app.put('/update/projects/:id',authorize('admin'), async (req, res) => {
  try {
    const data =  req.body
    data.assignedTo = data.assignedTo.map(id => new ObjectId(id))
    const response = await db.update(req.params.id, data, 'projects')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar el proyecto.' });
  }
})

app.delete('/delete/projects/:id',authorize('admin'), async (req, res) => {
  try {
    const response = await db.delete(req.params.id, 'projects')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el proyecto.' });
  }
})

app.post('/filter/projects', async (req, res) => {
  try {
    const data =  req.body
    if (data.assignedTo) data.assignedTo = new ObjectId(data.assignedTo)
    console.log('data', data)
    const  response = await db.getFilter(data, 'projects')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al filtrar los proyectos:', error);
    res.status(500).json({ message: 'Error al filtrar los proyectos.' });
  }
})

app.get('/read/projects/users', async (req, res) => {
  res.json(await db.getProjectsWithUsers({}, 'projects'))
})

// Tasks //

app.post('/create/tasks', authorize('admin'), async (req, res) => {
  try {
    const data =  req.body
    data.assignedTo = new ObjectId(data.assignedTo)
    data.projectId = new ObjectId(data.projectId)
    const response = await db.create(data, 'tasks')
    res.status(201).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea.' });
  }
})

app.get('/read/tasks', async (req, res) => {
  res.json(await db.get({}, 'tasks'))
})

app.put('/update/tasks/:id', authorize('user'), async (req, res) => {
  try {
    const data =  req.body
    data.assignedTo = new ObjectId(data.assignedTo)
    const response = await db.update(req.params.id, data, 'tasks')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea.' });
  }
})

app.delete('/delete/tasks/:id', authorize('admin'), async (req, res) => {
  try {
    const response = await db.delete(req.params.id, 'tasks')
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea.' });
  }
})

app.post('/filter/tasks', async (req, res) => {
  try {
    const data = req.body
    if (data.projectId) data.projectId = new ObjectId(data.projectId)
    console.log(data)
    const response = await db.getTasks(data)
    res.status(200).json({ message: 'OK', data: response });
  } catch (error) {
    console.error('Error al filtrar las tareas:', error);
    res.status(500).json({ message: 'Error al filtrar las tareas.' });
  }
})


// Endpoints //

app.listen(port, () => {
  console.log(`Project Tool listening on port ${port}`)
})
