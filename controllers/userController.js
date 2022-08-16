const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const twilio = require('twilio');

// @desc    Register new user
// @route   POST /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, role, company } = req.body

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
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


const forgetPassword = asyncHandler(async (req, res) => {
    const { email, password, newpassword } = req.body
    var newpass
    // Check for user email
    const user = await User.findOne({ email })
    //check if user info email and pass are correct 
    if (user && (await bcrypt.compare(password, user.password))) {
        const salt = await bcrypt.genSalt(10)
        newpass = await bcrypt.hash(newpassword, salt)
        updatedUser = await User.findByIdAndUpdate(user._id, { password: newpass }, {});
        const accountSid = 'ACb6f469cc427a1d8ecbfee4779793b6d5'; // Your Account SID from www.twilio.com/console
        const authToken = 'c955b3bc207df8dac74e4287705484cd'; // Your Auth Token from www.twilio.com/console
        const client = new twilio(accountSid, authToken);

        client.messages
        .create({
          body: 'Hello ,your password has been changed',
          to: '+21629162035', // Text this number
          from: '+12517582665', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));

        res.status(200).json(updatedUser)

    } else {
        res.status(400).json({ message: 'Invalid credentials' })
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

const deleteAllUsers = async (req, res) => {
    id = req.params.id;
    console.log(id)
    User.findByIdAndDelete(id, (err, data) => {
        res.status(200).json({ message: 'user deleteed' })

    });
}

const deleteusersApi = async (req, res) => {
    User.deleteMany({ role: "ROLE_EMPLOYEE" }, (err, data) => {
        res.status(200).json({ message: err })

    });

}

//Admin societe updating employee informations 
const updateUser = async (req, res, next) => {
    const email = req.body.email
    // Check if user exists
    const user = await User.findById(req.params.id);
    let updatedUser = null

    if (email != user.email) {
        const userExists = await User.findOne({ email })
        if (userExists) {
            res.status(400).json({ message: "user with that email already exists " });
        }
        else if (!userExists) {
            if (typeof req.body.password === 'undefined') {
                updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});
            }
            else {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
                updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});
            }
            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser,
                },
            });
        }

    }
    else {
        if (typeof req.body.password === 'undefined') {
            updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});
        }
        else {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
            updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});

        }

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    }
};


const updateAdminCompany = async (req, res, next) => {

    const email = req.body.email
    // Check if user exists
    const user = await User.findById(req.params.id);

    if (email != user.email) {
        console.log("here4")
        const userExists = await User.findOne({ email })
        if (userExists) {
            res.status(400).json({ message: "user with that email already exists " });
        }
        else if (!userExists) {
            console.log("here2")
            updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});
            res.status(200).json({
                status: 'success',
                data: {
                    company: updatedUser,
                },
            });
        }
    }
    else {

        updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {});
        res.status(200).json({
            status: 'success',
            data: {
                company: updatedUser,
            },
        });

    }

};


module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    deleteAllUsers,
    deleteusersApi,
    updateUser,
    updateAdminCompany,
    forgetPassword
}