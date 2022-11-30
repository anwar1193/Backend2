const express = require('express');
const router = express.Router();
const {getAllSeller, profile, registerSeller, login, refreshToken, updateSeller, deleteSeller} = require('../controller/seller');
const {protect} = require('../middleware/auth');

// router.get('/search', protect, sellerController.search);
router
    .get('/', protect, getAllSeller)
    .get('/profile', protect, profile)
    .post('/register', registerSeller)
    .post('/login', login)
    .post('/refresh-token', refreshToken)
    .put('/update-profile', protect, updateSeller)
    .delete('/:id', protect, deleteSeller);

module.exports = router