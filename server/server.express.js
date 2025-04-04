import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
//import { db } from "./server.mongodb.js";
//import { ObjectId } from "mongodb";
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






app.listen(port, () => {
  console.log(`My Rugby League listening on port ${port}`)
})
