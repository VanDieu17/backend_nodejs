const express   = require('express');


const {
    createSize,
    updateSize,
    deleteSize,
    getSize,
    getAllSize
} = require('../controller/sizeController')

const {
    authMiddleware,
    isAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/:id', getSize)
router.get('/', getAllSize)

router.post('/',authMiddleware,isAdmin, createSize)
router.put('/:id',authMiddleware,isAdmin,updateSize)
router.delete('/:id',authMiddleware,isAdmin, deleteSize)


module.exports = router