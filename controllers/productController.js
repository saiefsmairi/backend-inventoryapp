const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Product = require('../models/product')
const Zone = require('../models/zone')

// @desc    create a new product
// @route   POST /product
// @access  Public
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

    console.log(zone)
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
module.exports = {
    addProduct,
    FindProductsById
}