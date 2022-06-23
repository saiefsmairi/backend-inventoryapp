const express = require('express')
const router = express.Router()
const {
  registerUser,loginUser,getMe,getAllUsers
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect,verifyRoles("ROLE_ADMIN_COMPANY"),getMe)
//router.get('/users',protect, verifyRoles(ROLES_LIST.ROLE_ADMIN_COMPANY),getAllUsers)

module.exports = router