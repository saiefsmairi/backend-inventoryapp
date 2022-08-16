const express = require('express')
const router = express.Router()
const {
  registerUser, loginUser, getMe, getAllUsers, deleteAllUsers, deleteusersApi, updateUser, updateAdminCompany,forgetPassword
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', registerUser)
router.post('/login', loginUser)
router.put('/forgetPassword/test', forgetPassword)

router.get('/me', protect, getMe)
router.get('/users', protect, getAllUsers)
router.delete('/:id', deleteAllUsers)
router.delete('/useroutes/deleteallemployees', deleteusersApi) //this api delete all users with role employee
router.put('/updateuser/:id', protect, updateUser)
router.put('/updateAdminCompanyuser/wiw1/wiw/:id', updateAdminCompany)

//router.get('/me', protect,verifyRoles("ROLE_ADMIN_COMPANY"),getMe)

//i need to check for every method token and i need to do route protection based on roles 
module.exports = router