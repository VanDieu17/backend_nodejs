const express = require('express')

const {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
} = require('../controller/enquiryController')

const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/:id', getEnquiry)
router.get('/', getAllEnquiry)

router.post('/',authMiddleware,isAdmin, createEnquiry)
router.put('/:id',authMiddleware,isAdmin,updateEnquiry)
router.delete('/:id',authMiddleware,isAdmin, deleteEnquiry)


module.exports = router