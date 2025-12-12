const path = require('path');
const fs = require('fs');
const envPath = path.resolve(__dirname, '.env');

console.log("---------------------------------------------------");
console.log("[DEBUG] Server Startup Sequence");
console.log("[DEBUG] Looking for .env at:", envPath);
console.log("[DEBUG] File exists?", fs.existsSync(envPath));

const connectDB = require('./config/mongodb');

require('dotenv').config({ path: envPath });
connectDB(); // Connect to MongoDB

console.log("[DEBUG] GEMINI_API_KEY Loaded?", process.env.GEMINI_API_KEY ? "YES" : "NO");
if (process.env.GEMINI_API_KEY) {
    console.log("[DEBUG] Key Length:", process.env.GEMINI_API_KEY.length);
}
console.log("---------------------------------------------------");
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Contactless Banking API Running');
});

// Import Routes (Placeholder)
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const cardRoutes = require('./routes/cards');
const beneficiaryRoutes = require('./routes/beneficiaries');
const supportRoutes = require('./routes/support');
const accountRoutes = require('./routes/accounts');
const aiRoutes = require('./routes/ai');
const securityRoutes = require('./routes/security');
const adminRoutes = require('./routes/admin');
const rewardRoutes = require('./routes/rewards');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', rewardRoutes);

const PORT = process.env.PORT || 5000;

const { sequelize } = require('./models');

// Database Sync & Server Start
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
