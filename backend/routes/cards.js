const express = require('express');
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardIdSchema, cardCreateSchema } = require('../middlewares/validationSchemas');

const router = express.Router();

router.get('/', getCards);
router.post('/', celebrate(cardCreateSchema), createCard);
router.delete('/:cardId', celebrate(cardIdSchema), deleteCard);
router.put('/:cardId/likes', celebrate(cardIdSchema), likeCard);
router.delete('/:cardId/likes', celebrate(cardIdSchema), dislikeCard);

module.exports = router;
