const HttpError = require('../error/http-error')
const ytdl = require('ytdl-core')

exports.getVideoInfo = async (req, res, next) => {
	try {
		const url = req.query.url
		if (!url) {
			const error = new HttpError('Url is required!', 400)
			return next(error)
		}

		const info = await ytdl.getInfo(url)

		const sortFn = (a, b) => {
			if (a.contentLength && b.contentLength) {
				return Number(b.contentLength) - Number(a.contentLength)
			} else {
				return b.width - a.width
			}
		}

		const audios = info.formats
			.filter(f => !f.hasVideo)
			.sort((a, b) => b.audioBitrate - a.audioBitrate)
		const videosWithAudio = info.formats
			.filter(f => f.hasAudio && f.hasVideo)
			.sort(sortFn)
		const videosNoAudio = info.formats.filter(f => !f.hasAudio).sort(sortFn)

		const response = {
			all_info: info,
			videoDetails: info.videoDetails,
			audios,
			videosWithAudio,
			videosNoAudio,
			ok: true,
		}

		res.json(response)
	} catch (err) {
		console.error(err)
		if (
			err.name === 'TypeError' ||
			err.message.split(':')[0] === 'No video id found' ||
			err.message.split(':')[0] === 'Not a YouTube domain'
		) {
			const error = new HttpError('Invalid Url', 400)
			return next(error)
		}
		const error = new HttpError()
		next(error)
	}
}
