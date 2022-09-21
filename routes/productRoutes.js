const express = require('express')
const router = express.Router()
const {
    addProduct, FindProductsById, CountProductsByZone, findProductsByZone, CountProductsByZoneStats, uploadinventoryfile, codebarFindProducts
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../public/uploads/`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

router.post('/', addProduct)
router.post('/FindProductsById', FindProductsById)
router.post('/CountProductsByZone', CountProductsByZone)
router.get('/getproductsbyzone/:id', findProductsByZone)
router.get('/CountProductsByZoneStats/:id', CountProductsByZoneStats)
router.post("/productsfilesupload", upload.single("file"), uploadinventoryfile)
router.post('/codebarFindProducts/test1/', codebarFindProducts)

//i need to check for every method token and i need to do route protection based on roles 
module.exports = router