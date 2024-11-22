import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { BACKEND_PORT } from './config/index.js';
import sequelize from './database/conexion.js';

const port = BACKEND_PORT || 3000;
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});