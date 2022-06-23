const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')

// @desc    Register new user
// @route   POST /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone,role,company } = req.body

    if (!firstName || !lastName || !email || !password || !phone) {
        res.status(400).json({ message: "Please add all fields" });

    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400).json({ message: "user already exist" });
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400).json({ message: "Invalid user data" });
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role:user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


// @desc    Get user data
// @route   GET /users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})



// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

const getAllUsers = async (req, res) => {
    User.find({}, function (err, users) {
    res.send(users)
  });

}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers
}