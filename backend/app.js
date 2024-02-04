const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser');
const winston = require('winston');
require('dotenv').config();
const expressWinston = require('express-winston');
const cors = require('cors');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registrationSchema, loginSchema } = require('./middlewares/validationSchemas');
const NotFoundError = require('./errors/not-found');

const app = express();
const PORT = process.env.PORT || 3000;
const allowedCors = [
  'https://ksokolovsky.nomoredomainsmonster.ru',
  'https://api.ksokolovsky.nomoredomainsmonster.ru',
  'http://ksokolovsky.nomoredomainsmonster.ru',
  'http://api.ksokolovsky.nomoredomainsmonster.ru',
  'http://localhost:3000',
  'https://localhost:3000'
];

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log', format: winston.format.json() }),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
  expressFormat: true,
  colorize: false,
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', format: winston.format.json() }),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(requestLogger); // req logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.post('/signin', loginSchema, login);
app.post('/signup', registrationSchema, createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден. Неизвестный маршрут'));
});

app.use(errorLogger); // error logging

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
