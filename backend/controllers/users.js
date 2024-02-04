const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');
const { jwtSecret } = require('../config');

// Получение всех пользователей
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (error) {
    return next(error);
  }
};

// Получение пользователя по ИД
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send({ data: user }); // Добавлен return
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Неверный формат id пользователя'));
    }
    return next(error); // Добавлен return
  }
};

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Этот email уже зарегистрирован'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для обновления профиля'));
    } else {
      next(error);
    }
  }
};

exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
    } else {
      next(error);
    }
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    next(new BadRequestError('Некорректный формат email'));
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильные почта или пароль'));
            return;
          }
          console.log(jwtSecret, 'жвт секрет в контроллере логина')
          const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

          // res.cookie('jwt', token, {
          //   maxAge: 3600000 * 24 * 7,
          //   httpOnly: true,
          // });
          res.send({ token, message: 'Аутентификация прошла успешно' });
        })
        .catch(next);
    })
    .catch(next);
};
