const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const {router:authRoutes} = require('./routes/auth');
const taxiRoutes = require('./routes/taxis');
const bookingRoutes = require('./routes/bookings');
const { initializeSocket } = require('./socket/socketHandler');
const pool = require('./config/database'); // Add this line

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/taxis', taxiRoutes);
app.use('/api/bookings', bookingRoutes);

// Initialize Socket.IO
initializeSocket(io);

pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database successfully!');
    client.release();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });
