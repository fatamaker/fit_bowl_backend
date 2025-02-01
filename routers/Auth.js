const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); 
const  authenticate = require('../middleware/authenticate');
const multer = require("multer");
require("dotenv").config();
const User = require('../models/User');

// User Registration
router.post('/register', AuthController.register);

// User Login
router.post('/login', AuthController.login);

// Get User Profile by ID
router.get('/profile/:id', AuthController.profilgetById);

// Update User Profile
router.put('/profile/update', AuthController.UpdateProfil);

// Refresh Token
router.post('/refresh-token', AuthController.refreshtoken);

// Update Password
router.put('/update-password' ,AuthController.updatepassword);

//forget Password
router.post('/forgetPassword', AuthController.forgetPassword)

router.post('/VerifCode', AuthController.VerifCode)

router.post('/Resetpassword', AuthController.Resetpassword)

router.put("/user/image/:id",AuthController.updateUserImage);



filename = "";
const mystorage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let f1 = date + "." + file.mimetype.split("/")[1];
    redirect(null, f1);
    filename = f1;
  },
});
const upload = multer({ storage: mystorage });
router.post("/updateImage", upload.any("image"), async (req, res) => {
  var id = req.body.id;
  try {
    await User.findByIdAndUpdate(id, {
      imageUrl:
        "http://" +
        process.env.IP_ADDRESS +
        ":" +
        process.env.PORT +
        "/uploads/images/" +
        filename,
    });
    res.status(200).json({
      message: "image updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the router
module.exports = router;
