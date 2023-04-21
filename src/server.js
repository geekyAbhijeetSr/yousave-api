const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./api/error/error-handler')
const unknownRoutesHandler = require('./api/error/unknown-routes-handler')
const ytRoutes = require('./api/routes/yt-routes')

// basic config
const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors({ origin: process.env.ALLOWED_ORIGIN }))

// routes
server.use('/yt', ytRoutes)

// error handing
server.use(unknownRoutesHandler)
server.use(errorHandler)

// start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`\nServer is running on port ${PORT}\n`))
