const express = require('express')
const router = express.Router()
const {
    addArea,deleteAreaFromCompany,deleteArea,updateArea,FindAreaAndTheirZonesByCompany
} = require('../controllers/areaController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.put('/', addArea)
router.put('/updateCompany/RemoveAreaFromCompany',deleteAreaFromCompany)
router.delete('/deletearea/:id', deleteArea)
router.put('/updatearea/:id', updateArea)
router.get('/getareaandTheirZoneByCompany/:companyid', FindAreaAndTheirZonesByCompany)



/* router.get(' /getCompanyByAdmin/:id',protect,FindCompanyByAdminCompanyId)
router.put('/:idcompany/:idarea', updateArea)
 */


//i need to check for every method token and i need to do route protection based on roles 
module.exports = router