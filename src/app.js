const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const notFoundHandler = require('./middlewares/not-found');
const authRoutes = require('./routes/auth-routes');
const usersRoutes = require('./routes/users-routes');
const guildsRoutes = require('./routes/guilds-routes');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, usersRoutes);
app.use('/guilds', authMiddleware, guildsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
