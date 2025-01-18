const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const nodemailer=require("nodemailer");
const OTP = require('../models/OTP');

// Registration function
// This function handles the registration of a new user by checking if the email already exists, hashing the password, and saving the user to the database.
const register = async (req, res) => {
    try {
       
        const userExists = await User.countDocuments({ email: req.body.email });
        if (userExists > 0) {
            return res.status(403).json({ message: "User already exists" });
        }

     
        bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

           
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                imageUrl: req.body.imageUrl,
                password: hashedPass,
                gender: req.body.gender,
                birthDate: null,
            });

           
            const savedUser = await user.save();
            res.status(201).json({
                message: "User added successfully",
                uId: savedUser.id,
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Error occurred during registration" });
    }
};

// Login function
// This function verifies the user's credentials and generates JWT and refresh tokens upon successful login.
const login = (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.json({ error: err });
            }

            if (result) {
                // Generate JWT token and refresh token
                const token = jwt.sign({ email: user.email }, 'secretValue', { expiresIn: '7d' });
                const refreshToken = jwt.sign({ name: user.firstName }, 'refreshtokensecret', { expiresIn: '7d' });

                // Calculate token expiration time
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 7);

                // Respond with tokens and user details
                res.status(200).json({
                    message: "Login successful",
                    token,
                    refreshToken,
                    tokenExpiration: moment(expirationDate).format('YYYY-MM-DD HH:mm:ss'),
                    Uid: user._id,
                });
            } else {
                res.status(202).json({ message: "Password does not match!" });
            }
        });
    });
};

// Get user profile by ID
// This function fetches the user's profile details (excluding the password) based on their ID.


const profilgetById = async (req, res) => {
    const { id } = req.params; 

 
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
      
        const user = await User.findOne({ _id: id }, { password: 0 });

        if (user) {
            res.status(200).json({
                message: "User retrieved successfully",
                user,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Update user profile
// This function updates the user's profile information such as name, email, phone, address, and other fields.
const UpdateProfil = async (req, res) => {
    const { firstName, lastName, id, email, phone, address, imageUrl, gender, birthDate } = req.body;

    try {
        // Update the user details in the database
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phone, address, imageUrl, gender, birthDate },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Profile not updated" });
    }
};

// Refresh JWT token
// This function generates a new JWT token if the provided refresh token is valid.
const refreshtoken = (req, res) => {
    const { refreshtoken, uid } = req.body;

    // Verify the refresh token
    jwt.verify(refreshtoken, 'refreshtokensecret', (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: err });
        }

        // Generate a new JWT token
        const token = jwt.sign({ email: decoded.email }, 'secretValue', { expiresIn: '15m' });
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 15);

        res.status(200).json({
            message: "Token refreshed",
            token,
            refreshtoken,
            tokenExpiration: moment(expirationDate).format('YYYY-MM-DD HH:mm:ss'),
            Uid: uid,
        });
    });
}; 

// Update user password
// This function updates the user's password after verifying the old password.
const updatepassword = async (req, res) => {
    const { oldPassword, newPassword, id } = req.body;

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

       
        bcrypt.compare(oldPassword, user.password, async (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            if (result) {
                
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                
                await User.findByIdAndUpdate(user.id, { password: hashedNewPassword });
                res.json({ message: "Password updated successfully" });
            } else {
                res.status(202).json({ message: "Wrong password" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const emaill = req.body.email;
        const random = Math.floor(1000 + Math.random() * 9000);

        const user = await User.findOne({ email: emaill });
        if (!user) {
            return res.status(404).json({
                message: 'No email found',
            });
        }

        const htmlMessage = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>code for the pass</title>
          <style>
            /* General Reset */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
        
            /* Body Styles */
            body {
              font-family: Arial, sans-serif;
              background: #ADEBB3;
              color: #fff;
              padding: 0;
              margin: 0;
            }
        
            /* Main Email Container */
            .email-container {
              max-width: 700px;
              margin: 50px auto;
              background: #fff;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            }
        
            /* Header Styles */
            .email-header {
              text-align: center;
              padding: 25px;
              background-color: #ADEBB3;
              border-radius: 10px 10px 0 0;
            }
        
            .email-header h1 {
              font-size: 2.5rem;
              font-weight: bold;
              margin-bottom: 15px;
            }
        
            .email-header img {
              width: 80px;
              margin-top: 15px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }
        
            /* Email Content Section */
            .email-content {
              font-size: 18px;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              background: #fff;
              border-radius: 10px;
              margin-top: 20px;
            }
        
            .email-content p {
              margin-bottom: 20px;
            }
        
            .email-content blockquote {
              font-style: italic;
              color: #555;
              border-left: 4px solid #B22B2B;
              padding-left: 20px;
              margin: 15px 0;
            }
        
            /* Icon Section */
            .email-icons {
              text-align: center;
              padding: 20px;
              margin-top: 20px;
            }
        
            .email-icons img {
              margin: 10px;
              width: 60px;
              height: 60px;
              transition: transform 0.3s ease;
            }
        
            .email-icons img:hover {
              transform: scale(1.1);
            }
        
            /* Footer Section */
            .email-footer {
              font-size: 14px;
              color: #bbb;
              text-align: center;
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px solid #ccc;
            }
        
            .email-footer p {
              margin-bottom: 10px;
            }
        
            .email-footer a {
              color:rgb(89, 126, 92);
              text-decoration: none;
              font-weight: bold;
            }
        
            .email-footer a:hover {
              text-decoration: underline;
            }
        
            /* Responsive Styles */
            @media (max-width: 600px) {
              .email-container {
                padding: 20px;
                margin: 20px;
              }
        
              .email-header h1 {
                font-size: 2rem;
              }
        
              .email-content {
                font-size: 16px;
              }
        
              .email-icons img {
                width: 50px;
                height: 50px;
              }
            }
          </style>
        </head>
        <body>
        
          <div class="email-container">
            <!-- Header Section -->
            <div class="email-header">
              <h1>Thank You for Contacting Us!</h1>
              <img src="https://img.icons8.com/?size=100&id=TlHGRnWaE1Fx&format=png&color=000000" alt="salade">
            </div>
        
            <!-- Email Content Section -->
            <div class="email-content">
              <p>Hi <strong>,</p>
              <p>We heard that you lost your application password.\n Sorry about that! But don’t worry!\n You can use the following CODE to reset your password : <strong>\n  ${random}</strong></p>
              <p><strong>healthy-salade SupportTeam</strong></p>
            </div>
        
            <!-- Icons Section-->
            <div class="email-icons">
              <img src="https://img.icons8.com/?size=100&id=56700&format=png&color=000000" alt="salad"/>
              <img src="https://img.icons8.com/?size=100&id=12754&format=png&color=000000" alt="--salad"/>
            </div>
        
            <!-- Footer Section -->
            <div class="email-footer">
              <p>&copy; 2025 Fit Bowl. All rights reserved.</p>
              <p>Contact us: <a href="mailto:blood.connect.teams@gmail.com">fit.bowl.teams@gmail.com</a> | +216 557 166</p>
            </div>
          </div>
        
        </body>
        </html>
        `;
        const details = {
            from: "fit.bowl.teams@gmail.com",
            to: emaill,
            subject: "Please reset your password",
            html: htmlMessage,
        };

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "fit.bowl.teams@gmail.com", pass: "yrnr ygcs mano razw" },
        });

        // Send email
        mailTransporter.sendMail(details, async (err) => {
            if (err) {
                return res.status(500).json({ message: err.message || "Failed to send email" });
            }

            // Create OTP with 15 minutes expiry
            const date = new Date(Date.now());
            date.setMinutes(date.getMinutes() + 15);

            const otp = new OTP({ email: emaill, otp: random, expiry_date: date });

            const oldOTP = await OTP.findOne({ email: emaill });
            if (!oldOTP) {
                await otp.save();
            } else {
                oldOTP.expiry_date = otp.expiry_date;
                oldOTP.otp = otp.otp;
                await OTP.findByIdAndUpdate(oldOTP.id, oldOTP);
            }

            // Send success response
            return res.json({
                message: `Email sent successfully`,
            });
        });
    } catch (error) {
        // Catch and return any unhandled errors
        res.status(500).json({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};

const VerifCode = (req,res,next)=>{
    var codee =req.body.otp
    var emaill = req.body.email

    OTP.findOne({$and:[{otp:codee},{email:emaill}]})
    .then(otp=>{
        if(otp){
            let  date =new Date( Date.now())
            date.setMinutes(date.getMinutes()+0)
           
            if(otp.expiry_date<date){
                return res.status(400).json({
                    message : `expired code`,
                })
            }else{
                res.json({
                        message : `code suuccessful`,
                     
                    })
            }

                        
        }else{
            return  res.status(404).json({
                message : 'no code found '
            })
        }
    })
}

const Resetpassword = async (req,res)=>{
    var passwordd = req.body.password
    var emaill = req.body.email

    bycrypt.hash(passwordd,10,async function(err,hashedPass){
        if(err){
            return  res.status(500).json({
                message : err
            })
        }
        await User.findOne({email:emaill})
        .then(async user=>{
            if(user){
                await User.findByIdAndUpdate(
                    user.id, { 
                    password: hashedPass });
                            res.json({
                            message : `password updated suuccessful`,
                         
                        })
            }else{
                return  res.status(404).json({
                    message : 'no user  found'
                })
            }
        })
    })

    
}


         










module.exports = {
    register,
    login,
    profilgetById,
    UpdateProfil,
    refreshtoken,
    updatepassword,
    forgetPassword,
    Resetpassword,
    VerifCode,
};
