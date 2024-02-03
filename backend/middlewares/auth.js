const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  // Авторизация через тело. Решил потестить авторизацию через куки
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   next(new UnauthorizedError('Необходима авторизация'));
  //   return;
  // }

  // const token = authorization.replace('Bearer ', '');

  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  try {
    const payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
