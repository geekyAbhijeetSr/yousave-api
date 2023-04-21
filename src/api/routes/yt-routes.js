const { Router } = require('express')
const ytController = require('../controllers/yt-controller')

const router = Router()

router.get('/video-info', ytController.getVideoInfo)

module.exports = router