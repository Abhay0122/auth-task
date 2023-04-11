const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    otp: String,
},
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

userSchema.method.jwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWTSECERETKEY, {
        expiresIn: process.env.TOKENEXPIRETIME
    })
};



const User = mongoose.model('User', userSchema);

module.exports = User;