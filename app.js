const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const { notFoundMiddleware, errorHandler } = require('./src/middleware/errorMiddleware');
const { apiLimiter } = require('./src/middleware/rateLimitMiddleware');
const { swaggerSpec, swaggerUi } = require('./src/config/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Finance Dashboard API is running',
      health: '/health',
      docs: '/api/docs'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorHandler);

module.exports = app;
