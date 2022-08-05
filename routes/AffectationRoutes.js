const express = require('express')
const router = express.Router()
const {
    addaffectation, findAffectationByCompany, deleteAffectation, updateAffectation, findAffectationByEmployee
} = require('../controllers/affectationController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', addaffectation)
router.get('/:companyid', findAffectationByCompany)
router.delete('/:affid', deleteAffectation)
router.put('/updateaffectation/:id', updateAffectation)
router.get('/findAffectationByEmployee/:employeeid', findAffectationByEmployee)

/* router.put('/updateCompany/RemoveAreaFromCompany',deleteAreaFromCompany)
router.delete('/deletearea/:id', deleteArea)
router.put('/updatearea/:id', updateArea)
 */


//i need to check for every method token and i need to do route protection based on roles 
module.exports = router