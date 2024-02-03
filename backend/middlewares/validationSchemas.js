const { celebrate, Joi } = require('celebrate');

const registrationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+)(#)?$/),
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
    link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+)(#)?$/),
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
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+)(#)?$/),
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
