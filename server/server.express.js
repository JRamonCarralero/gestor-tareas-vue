import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import { db } from "./server.mongodb.js";
import { ObjectId } from "mongodb";
import process from "node:process";

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
  res.json(await db.create(req.body, 'users'))
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

app.get('/findbyid/users/:id', async (req, res) => {
  res.json(await db.findById({ _id: new ObjectId(req.params.id) }, 'users'))
})



app.listen(port, () => {
  console.log(`Project Tool listening on port ${port}`)
})
