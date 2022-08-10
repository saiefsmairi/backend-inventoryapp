const express = require('express')
const router = express.Router()
const {
   getnotifbyUser
} = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')
const verifyRoles = require('../middleware/verifyRoles');


router.get('/getnotifbyUser/:id', getnotifbyUser)


//i need to check for every method token and i need to do route protection based on roles 
module.exports = router