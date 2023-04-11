var express = require('express');
var router = express.Router();

const User = require('../model/userSchema');
const { sendToken } = require('../utils/sendtoken');
const ErrorHandler = require("../utils/Errorhandler");
const { isAuthenticated } = require('../middleware/auth');
const { sendmailotp } = require('../utils/sendmail');


router.get('/home', (req, res, next) => {
  res.render('home', { user: req.user })
});

router.get('/', (req, res, next) => {
  res.json({ message: 'homepage', user: req.user })
})

router.get('/signup', (req, res, next) => {
  res.render('signup');
})

router.post('/signup', async (req, res, next) => {

  const { username, email, password } = req.body;

  const userCreated = {
    username,
    email,
    password
  }

  const user = await new User(userCreated).save()

  sendToken(user, res, 201);

});

router.get('/signin', (req, res, next) => {
  res.render('signin');
})

router.post('/signin', async (req, res, next) => {

  const userSingin = await User.findOne({ email: req.body.email }).exec();

  if (!userSingin) return next(new ErrorHandler("user not found!", 404));

  const isMatch = await userSingin.comparePassword(req.body.password);

  if (!isMatch) return next(new ErrorHandler("Wrong Credientials", 500));

  sendToken(userSingin, res, 200);

});

router.post('/logout', async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: 'Logout successfully!' })
})

router.post('/send-mail', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) return next(new ErrorHandler("User not found", 404));
  sendmailotp(user, res);
});

router.post('/forgot-password', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (user.otp == req.body.otp) {
    user.password = req.body.password;
    user.otp = "";
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } else {
    return next(new ErrorHandler("Invalid OTP", 500));
  }
});

router.post('/reset-password/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+password").exec();
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isMatch = user.comparePassword(req.body.oldpassword);
  if (!isMatch) return next(new ErrorHandler("Wrong Credientials", 500));

  user.password = req.body.newpassword;
  await user.save();

  sendToken(user, res, 200);
});

router.post('/update-user/:id', async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, req.body).exec();
  res.status(200).json({
    success: true,
    message: "User Successfully Updated",
  });
});

module.exports = router;
