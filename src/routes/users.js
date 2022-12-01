const express = require('express');
const router = express.Router();
const {register, login, registerSeller, updateSeller, profile, refreshToken, updateUser} = require('../controller/users')
const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/registerSeller', registerSeller);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, profile);
router.put('/update-profile', protect, updateUser);
router.put('/update-profile-seller', protect, updateSeller);

module.exports = router