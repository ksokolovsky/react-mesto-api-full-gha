const { celebrate, Joi } = require('celebrate');

const registrationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+[^\s]*$/),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

const cardCreateSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri({
      scheme: ['http', 'https'], // Указывает допустимые схемы для URI
    }),
  }),
};

const updateProfileSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+[^\s]*$/),
  }),
});

const userIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  userIdSchema,
  updateProfileSchema,
  updateAvatarSchema,
  registrationSchema,
  cardIdSchema,
  cardCreateSchema,
  loginSchema,
};
