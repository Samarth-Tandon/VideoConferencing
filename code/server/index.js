
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import roomHandler from './socket/roomHandler.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middleware setup
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cors());

// Routes
app.use('/auth', authRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log('User connected');
  roomHandler(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Database connection
const dbURI = 'mongodb+srv://samarth:<1234>@video-conferencing-db.5rbvm.mongodb.net/'; // MongoDB Atlas connection string

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected');
    server.listen(6001, () => {
      console.log('Server running on port 6001');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

