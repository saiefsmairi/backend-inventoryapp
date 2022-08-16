const express = require('express')
const router = express.Router()
const {
    addProduct,FindProductsById,CountProductsByZone,findProductsByZone,CountProductsByZoneStats
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', addProduct)
router.post('/FindProductsById', FindProductsById)
router.post('/CountProductsByZone', CountProductsByZone)

router.get('/getproductsbyzone/:id', findProductsByZone)
router.get('/CountProductsByZoneStats/:id', CountProductsByZoneStats)

//i need to check for every method token and i need to do route protection based on roles 
module.exports = router