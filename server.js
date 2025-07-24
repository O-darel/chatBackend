const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      user: '/api/v1/user',
      chat: '/api/v1/chat'
    }
  });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api//v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);


app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableRoutes: {
      home: '/',
      auth: '/api/v1/auth',
      user: '/api/v1/user',
      chat: '/api/v1/chat'
    }
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));