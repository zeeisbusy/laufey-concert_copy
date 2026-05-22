const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { authSchema } = require('../validations/schemas');

const router = express.Router();

router.post('/register', validate(authSchema), authController.register);
router.post('/login', validate(authSchema), authController.login);

module.exports = router;
