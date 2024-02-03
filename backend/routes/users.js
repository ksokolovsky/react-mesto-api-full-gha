const express = require('express');

const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/users');
const { updateProfile, updateAvatar } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');
// const { createUser } = require('../controllers/users');
const { updateProfileSchema, updateAvatarSchema, userIdSchema } = require('../middlewares/validationSchemas');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdSchema, getUserById);
// router.post('/signup', registrationSchema, createUser);
router.patch('/me', updateProfileSchema, updateProfile);
router.patch('/me/avatar', updateAvatarSchema, updateAvatar);

module.exports = router;
