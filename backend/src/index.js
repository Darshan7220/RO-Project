
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import router from './Routes/index.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';


dotenv.config();

const { WHITE_LIST_URL } = process.env;

if (!WHITE_LIST_URL) {
  throw new Error('WHITE_LIST_URL is not defined in the environment variables');
}

const whitelist = WHITE_LIST_URL.split(',');
console.log('Whitelist:', whitelist);

var app = express();
const port = process.env.PORT || 5100;

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: whitelist
  }
})

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true)
    }
    else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions)); app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1', router);

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, () => {
  console.log(`Server running on host ${HOST} and port ${PORT}`);
});
