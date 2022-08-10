const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Area = require('../models/area')
const Zone = require('../models/zone')
const Product = require('../models/product')
const Notification = require('../models/notification')


const getnotifbyUser = async (req, res, next) => {
    User.findById({ _id: req.params.id }, function (err, user) {
        res.status(200).json(user)
    }).populate('notifications.notification')

}




module.exports = {
    getnotifbyUser
}