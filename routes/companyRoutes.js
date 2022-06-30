const express = require('express')
const router = express.Router()
const {
FindCompanyByAdminCompanyId,
addCompany,updateCompany,updateCompanyAddEmployees
} = require('../controllers/companyController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', addCompany)
router.get('/getCompanyByAdmin/:id',protect,FindCompanyByAdminCompanyId)
router.put('/:id', updateCompany)
router.put('/updateCompany/AddEmployees', updateCompanyAddEmployees)


//i need to check for every method token and i need to do route protection based on roles 
module.exports = router