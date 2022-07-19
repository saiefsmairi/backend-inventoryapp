const express = require('express')
const router = express.Router()
const {
    addZone,FindZoneByArea,deleteZoneFromArea,deleteZone
} = require('../controllers/zoneController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.put('/', addZone)
router.post('/getzonebyarea', FindZoneByArea)
router.put('/updateZone/RemoveZoneFromArea',deleteZoneFromArea)
router.delete('/deletezone/:id', deleteZone)

/* router.put('/updateCompany/RemoveAreaFromCompany',deleteAreaFromCompany)
router.put('/updatearea/:id', updateArea)
 */


//i need to check for every method token and i need to do route protection based on roles 
module.exports = router