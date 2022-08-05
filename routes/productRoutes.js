const express = require('express')
const router = express.Router()
const {
    addProduct,FindProductsById
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', addProduct)
router.post('/FindProductsById', FindProductsById)



//i need to check for every method token and i need to do route protection based on roles 
module.exports = router