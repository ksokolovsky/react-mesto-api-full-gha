// const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

// Получаем все карточки
exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (error) {
    next(error);
  }
};

// Создаем новую карточку
exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для создания карточки'));
    } else {
      next(error);
    }
  }
};

// удаляем карточку, если она наша
exports.deleteCard = async (req, res, next) => {
  try {
    // if (!mongoose.isValidObjectId(req.params.cardId)) {
    //   next(new BadRequestError('Некорректный ID карточки'));
    //   return;
    // }

    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    if (card.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Недостаточно прав'));
      return;
    }

    await Card.findByIdAndDelete(req.params.cardId);
    res.send({ message: `Карточка ${card.name} удалена` });
  } catch (error) {
    next(error);
  }
};

// лайкаем карточку
exports.likeCard = async (req, res, next) => {
  try {
    // if (!mongoose.isValidObjectId(req.params.cardId)) {
    //   next(new BadRequestError('Некорректный ID карточки'));
    //   return;
    // }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.send({ data: updatedCard });
  } catch (error) {
    next(error);
  }
};

// Убираем лайк с карточки, если он наш
exports.dislikeCard = async (req, res, next) => {
  try {
    // if (!mongoose.isValidObjectId(req.params.cardId)) {
    //   next(new BadRequestError('Некорректный ID карточки'));
    //   return;
    // }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.send({ data: updatedCard });
  } catch (error) {
    next(error);
  }
};
