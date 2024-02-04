const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { jwtSecret } = require('../config');

module.exports = (req, res, next) => {
  // Авторизация через тело.
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  // const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  try {
    console.log(token, 'token v auth')
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
