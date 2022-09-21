const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Product = require('../models/product')
const FileInventory = require('../models/fileinventory')
const ProductsFromFile = require('../models/productsFromFile')

const Zone = require('../models/zone')
const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const XLSX = require('xlsx')
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

//this method for stats
//select name count from products where zone=zoneid groupby name
const CountProductsByZoneStats = async (req, res, next) => {
    Zone.findById({ _id: req.params.id }, function (err, zone) {
        console.log(zone)
        Product.aggregate([
            { "$match": { zone: zone._id } },
            { "$group": { _id: "$code", count: { $sum: 1 } } },
        ],
            function (err, data) {
                if (err)
                    throw err;

                res.status(200).json(data)

            }
        );

    })

}


const findProductsByZone = async (req, res, next) => {
    Product.find({ zone: req.params.id }, (err, prod) => {
        res.status(200).json(prod)
    });
}

const uploadinventoryfile = async (req, res, next) => {
    const {
        file, companyid
    } = req;

    console.log("-----------------")
    console.log(companyid)
    const workbook = XLSX.readFile(file.path)
    const workbookSheet = workbook.SheetNames[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[workbookSheet])

    //save the uploaded file infos withtout products extracted 
    const fileInventory = await FileInventory.create(
        {
            filename: file.filename,
            company: "630798a887dbf563861303fe",
        }
    )

    await dataExcel.forEach(element => {
        ProductsFromFile.create({
            code: element.code,
            name: element.name,
            uniteprice: element.uniteprice,
        }, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            console.log(res);

            FileInventory.findByIdAndUpdate({ _id: fileInventory._id }, { $push: { productsFromFile: { products: res } } }, function (err, ff) {
                if (err) {
                    console.log("****")
                    console.log(err)
                }
            })
        });

    });
    /* 
         ProductsFromFile.insertMany(dataExcel, (function (err) {
            if (err) {
                if (err.code === 11000) {
                    // Duplicate codeabar
                    return res.status(400).send({ succes: false, message: 'they are already products with same code that exist with products on this file!' });
                }
                // Some other error
                console.log(err)
            }
        })); */
}


const codebarFindProducts = async (req, res, next) => {
    const { codeabarProd, zone, idemployee, company, quantity, codeabarProdFromMachine, machine } = req.body
    console.log("***")
    console.log(codeabarProd)
    console.log(codeabarProdFromMachine)
    console.log(machine)
    console.log("***////")

    FileInventory.find({ company: company }, (err, file) => {
        file[0].productsFromFile.forEach(element => {
            console.log(element['products'].code)
            if (machine === 'FromPhone') {
                if (element['products'].code === codeabarProd) {
                    const product = Product.create({
                        name: element['products'].name,
                        code: element['products'].code,
                        //qte yhitha howa fel application
                        quantity: quantity,
                        price: element['products'].uniteprice,
                        employee: idemployee,
                        zone: zone
                    }, function (err, res) {
                        Zone.findByIdAndUpdate({ _id: zone }, { $push: { products: { product: res } } }, function (err, ff) {
                            if (err) {
                                console.log(err)
                            }

                        })
                    })
                }
            }

            else if (machine === 'FromMachine') {
                if (element['products'].code === codeabarProdFromMachine) {
                    const product = Product.create({
                        name: element['products'].name,
                        code: element['products'].code,
                        //qte yhitha howa fel application
                        quantity: quantity,
                        price: element['products'].uniteprice,
                        employee: idemployee,
                        zone: zone
                    }, function (err, res) {
                        Zone.findByIdAndUpdate({ _id: zone }, { $push: { products: { product: res } } }, function (err, ff) {
                            if (err) {
                                console.log(err)
                            }

                        })
                    })
                }
            }

        });
    }).populate('productsFromFile.products');
}


module.exports = {
    addProduct,
    FindProductsById,
    CountProductsByZone,
    findProductsByZone,
    CountProductsByZoneStats,
    uploadinventoryfile,
    codebarFindProducts
}