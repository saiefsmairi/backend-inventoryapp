const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Product = require('../models/product')
const Zone = require('../models/zone')

// @desc    create a new product
// @route   POST /product
// @access  Public
var products = []

const addProduct = asyncHandler(async (req, res) => {

    const { codeabarProd, name, quantity, price, zone, idemployee } = req.body
    const product = await Product.create({
        name: name,
        code: codeabarProd,
        quantity: quantity,
        price: price,
        employee: idemployee,
        zone: zone
    })

  
    Zone.findByIdAndUpdate({ _id: zone }, { $push: { products: { product: product } } }, function (err, ff) {
        if (err) {
            res.status(400).json({
                status: 'failed',
                message: err,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'a product has been added to the Zone succesfully  ',
            data: {
                Zone: ff,
            },
        });
    })

})

const FindProductsById = async (req, res, next) => {
    var prods = []
    var prods2 = []

    prods.push(req.body.data)
    prods.forEach(element => {
        console.log(element)
        Product.find({ _id: element.product }, function (err, prod) {
            console.log(prod)
            prods2.push(prod)
            res.status(200).json(prod)
        }).populate('zone').populate('employee');

    });
}

const CountProductsByZone2 = (req, res, next) => {
    var zones = []
    var tot = 0

    for (let i = 0; i < req.body.data.length; i++) {
        Product.find({ zone: req.body.data[i]._id }, (err, count) => {
            console.log(count)
            zones.push(count)
        });
        console.log(zones)
        res.status(200).json(zones)
    }
}

const CountProductsByZone = async (req, res, next) => {
    var zones = []
    var products = []
    req.body.data.forEach(element => {
        Product.countDocuments({ zone: element._id }, (err, count) => {
            console.log(count)
            products.push(count)
            console.log(products)
        });
    });
    res.status(200).json(products)
}
module.exports = {
    addProduct,
    FindProductsById,
    CountProductsByZone
}