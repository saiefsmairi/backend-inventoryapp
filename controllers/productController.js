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
        employee: idemployee
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


module.exports = {
    addProduct
}