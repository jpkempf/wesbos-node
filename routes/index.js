const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

/**
 * HOME PAGE
 * PATH: /
 */

router.get('/', storeController.homePage);

/**
 * ADD & EDIT STORES
 * PATH: /add
 */

router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
