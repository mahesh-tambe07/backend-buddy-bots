// 📁 backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./reminderScheduler');

const chatRoute = require('./routes/chat');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const automationRoute = require('./routes/automation');
const parseResumeRoute = require('./routes/parseResume');
const reminderRoutes = require('./routes/reminder');

const app = express();

// ✅ IMPORTANT FIX: Use Railway’s PORT (not DB_PORT)
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow your frontend URL
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use('/api/chat', chatRoute);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/automation', automationRoute);
app.use('/api/parse-resume', parseResumeRoute);
app.use('/api/reminder', reminderRoutes);

// ✅ Root route (for quick Railway check)
app.get('/', (req, res) => {
  res.send('🚀 Vyommitra backend is running successfully!');
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
