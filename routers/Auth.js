const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); 
const  authenticate = require('../middleware/authenticate')

// User Registration
router.post('/register', AuthController.register);

// User Login
router.post('/login', AuthController.login);

// Get User Profile by ID
router.get('/profile/:id', AuthController.profilgetById);

// Update User Profile
router.put('/profile/update',authenticate, AuthController.UpdateProfil);

// Refresh Token
router.post('/refresh-token', AuthController.refreshtoken);

// Update Password
router.put('/update-password',authenticate ,AuthController.updatepassword);

//forget Password
router.post('/forgetPassword', AuthController.forgetPassword)

router.post('/VerifCode', AuthController.VerifCode)

router.post('/Resetpassword', AuthController.Resetpassword)

// Export the router
module.exports = router;
